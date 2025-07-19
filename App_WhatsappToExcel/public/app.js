// public/app.js
// Lógica del frontend para WhatsAppToExcel (versión Electron)
// - Maneja la interfaz de usuario
// - Se comunica con el backend para obtener contactos y extraer mensajes
// - Integra funcionalidades nativas de Electron

// Elementos del DOM
const sidebar = document.getElementById('sidebar');
const contactList = document.getElementById('contact-list');
const selectedContactsDiv = document.getElementById('selected-contacts');
const selectedList = document.getElementById('selected-list');
const notifications = document.getElementById('notifications');

let contacts = [];
let filteredContacts = [];
let selectedContacts = [];

// Búsqueda por prefijo (case-insensitive, sin tildes)
function normalize(str) {
    return (str || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function filterContactsSidebar() {
    const search = normalize(document.getElementById('sidebar-search-contact').value);
    filteredContacts = contacts
        .filter(c => search === '' || normalize(c.name).startsWith(search))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    renderContactsSidebar();
}

// Renderiza la lista de contactos en la barra lateral
function renderContactsSidebar() {
    contactList.innerHTML = '';
    filteredContacts.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.name;
        li.onclick = () => addToSelectedSidebar(c);
        contactList.appendChild(li);
    });
}

// Agrega un contacto a la lista de seleccionados desde la barra lateral
function addToSelectedSidebar(contact) {
    if (!selectedContacts.find(c => c.id === contact.id)) {
        selectedContacts.push(contact);
        renderSelectedSidebar();
        showNotification('Contacto agregado a la lista de extracción');
    }
}

// Renderiza la lista de seleccionados en la barra lateral
function renderSelectedSidebar() {
    selectedList.innerHTML = '';
    selectedContacts.forEach((c, idx) => {
        const li = document.createElement('li');
        li.textContent = c.name;
        li.onclick = () => {
            selectedContacts.splice(idx, 1);
            renderSelectedSidebar();
        };
        selectedList.appendChild(li);
    });
}

// Muestra una notificación
function showNotification(msg, type = 'info') {
    notifications.textContent = msg;
    notifications.className = `notification ${type}`;
    notifications.style.display = 'block';
    setTimeout(() => notifications.style.display = 'none', 4000);
}

// Extrae mensajes de los contactos seleccionados
async function extractMessages() {
    if (selectedContacts.length === 0) {
        showNotification('Selecciona al menos un contacto.', 'warning');
        return;
    }
    
    showNotification(`Iniciando extracción de ${selectedContacts.length} contacto(s)...`, 'info');
    
    for (const c of selectedContacts) {
        try {
            const res = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactId: c.id })
            });
            if (res.ok) {
                showNotification(`Extracción completada para ${c.name}`, 'success');
            } else {
                showNotification(`Error al extraer de ${c.name}`, 'error');
            }
        } catch (error) {
            showNotification(`Error de conexión con ${c.name}`, 'error');
        }
    }
}

// Abre la carpeta de extracciones
async function openExtractionsFolder() {
    try {
        const result = await window.electronAPI.openFolder();
        if (!result.canceled && result.filePaths.length > 0) {
            showNotification('Carpeta de extracciones abierta', 'success');
        }
    } catch (error) {
        showNotification('Error al abrir la carpeta', 'error');
    }
}

// Obtiene la lista de contactos del backend y los ordena
async function fetchContacts() {
    try {
        const res = await fetch('/api/contacts');
        contacts = await res.json();
        filteredContacts = [...contacts].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        filterContactsSidebar();
        renderSelectedSidebar();
    } catch (error) {
        showNotification('Error al cargar contactos', 'error');
    }
}

// Verifica el estado y muestra el QR si es necesario
async function checkStatusAndQR() {
    const qrScreen = document.getElementById('qr-screen');
    const qrImgDiv = document.getElementById('qr-img');
    const qrStatus = document.getElementById('qr-status');
    const regenBtn = document.getElementById('regen-qr');
    let connected = false;
    let lastQR = null;

    async function poll() {
        try {
            const statusRes = await fetch('/api/status');
            const status = await statusRes.json();
            connected = status.connected;
            
            if (!connected) {
                document.body.classList.add('qr-active');
                qrScreen.style.display = 'flex';
                // Obtener QR
                const qrRes = await fetch('/api/qr');
                if (qrRes.ok) {
                    const { qr } = await qrRes.json();
                    if (qr !== lastQR) {
                        qrImgDiv.innerHTML = `<img src="${qr}" alt="QR de WhatsApp" />`;
                        lastQR = qr;
                    }
                    qrStatus.textContent = 'Esperando conexión...';
                    regenBtn.disabled = false;
                } else {
                    qrImgDiv.innerHTML = '';
                    qrStatus.textContent = 'Esperando QR...';
                    regenBtn.disabled = false;
                }
            } else {
                qrStatus.textContent = '¡Conexión exitosa!';
                setTimeout(() => {
                    qrScreen.style.display = 'none';
                    document.body.classList.remove('qr-active');
                }, 1500);
            }
        } catch (error) {
            console.error('Error en polling:', error);
        }
        setTimeout(poll, 1500);
    }

    regenBtn.onclick = async () => {
        regenBtn.disabled = true;
        qrStatus.textContent = 'Generando nuevo QR...';
        try {
            await fetch('/api/regen-qr', { method: 'POST' });
        } catch (error) {
            showNotification('Error al regenerar QR', 'error');
        }
        setTimeout(() => { regenBtn.disabled = false; }, 2000);
    };

    poll();
}

// Configurar listeners de Electron
function setupElectronListeners() {
    if (window.electronAPI) {
        // WhatsApp listo
        window.electronAPI.onWhatsAppReady(() => {
            showNotification('WhatsApp conectado exitosamente', 'success');
            fetchContacts();
        });

        // WhatsApp desconectado
        window.electronAPI.onWhatsAppDisconnected((event, data) => {
            showNotification(`WhatsApp desconectado: ${data.reason}`, 'warning');
        });

        // QR actualizado
        window.electronAPI.onQrUpdated((event, data) => {
            const qrImgDiv = document.getElementById('qr-img');
            if (data.qr) {
                qrImgDiv.innerHTML = `<img src="${data.qr}" alt="QR de WhatsApp" />`;
            }
        });

        // Extracción completada
        window.electronAPI.onExtractionComplete((event, data) => {
            showNotification(`Extracción completada: ${data.messageCount} mensajes de ${data.contactName}`, 'success');
        });
    }
}

// Inicializa la app
window.onload = () => {
    checkStatusAndQR();
    fetchContacts();
    setupElectronListeners();
    
    // Agregar botón para abrir carpeta de extracciones
    const mainContent = document.getElementById('main-content');
    const actionsDiv = mainContent.querySelector('.actions');
    
    const openFolderBtn = document.createElement('button');
    openFolderBtn.textContent = 'Abrir carpeta de extracciones';
    openFolderBtn.className = 'big-green secondary';
    openFolderBtn.onclick = openExtractionsFolder;
    actionsDiv.appendChild(openFolderBtn);
};
