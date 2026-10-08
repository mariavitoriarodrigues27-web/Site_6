/**
 * C.E.I.A.S - Colégio do Campo Irmã Ambrósia Sabatovich
 * Script de Interatividade, Expansão de Fotos e Atendimento Virtual
 */

let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initFormListeners();
});

/* ==========================================================================
   1. MENU HAMBÚRGUER RESPONSIVO
   ========================================================================== */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   2. SISTEMA DE NAVEGAÇÃO ENTRE ABAS
   ========================================================================== */
window.switchTab = function(event, tabId) {
  const allPanes = document.querySelectorAll('.tab-pane');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const targetPane = document.getElementById(tabId);

  if (!targetPane) return;

  allPanes.forEach(pane => pane.classList.remove('active'));
  allNavLinks.forEach(link => link.classList.remove('active'));

  targetPane.classList.add('active');

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.remove('open');

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ==========================================================================
   3. REVELA A FOTO DO EVENTO SOMENTE AO CLICAR EM CIMA DA NOTÍCIA
   ========================================================================== */
window.toggleNewsPhoto = function(cardElement) {
  if (!cardElement) return;
  cardElement.classList.toggle('active');

  const hint = cardElement.querySelector('.click-hint');
  if (hint) {
    if (cardElement.classList.contains('active')) {
      hint.innerText = 'Ocultar Foto ❌';
    } else {
      hint.innerText = 'Clique para ver a foto 📸';
    }
  }
};

/* ==========================================================================
   4. ACESSIBILIDADE
   ========================================================================== */
window.toggleContrast = function() {
  document.body.classList.toggle('high-contrast');
};

let fontScale = 100;
window.adjustFont = function(direction) {
  fontScale += direction * 5;
  if (fontScale < 85) fontScale = 85;
  if (fontScale > 125) fontScale = 125;

  document.body.style.fontSize = `${fontScale}%`;
};

/* ==========================================================================
   5. ENVIO DE MATRÍCULA VIA WHATSAPP
   ========================================================================== */
function initFormListeners() {
  const matInput = document.getElementById('matChatInput');
  if (matInput) {
    matInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') window.askMatriculaIA();
    });
  }

  const mainInput = document.getElementById('mainChatInput');
  if (mainInput) {
    mainInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') window.sendMainChatMessage();
    });
  }
}

window.processMatricula = function(event) {
  if (event) event.preventDefault();

  const studentName = document.getElementById('studentName')?.value.trim();
  const grade = document.getElementById('gradeSelect')?.value;
  const parentName = document.getElementById('parentName')?.value.trim();
  const phone = document.getElementById('phoneNum')?.value.trim();

  if (!studentName || !grade || !parentName || !phone) return;

  const schoolPhone = "5500999998888";
  const textMessage = `Olá! Gostaria de enviar a solicitação de pré-matrícula pública no *C.E.I.A.S* (%22Educando para a Comunidade%22):%0A%0A` +
                      `👤 *Aluno(a):* ${encodeURIComponent(studentName)}%0A` +
                      `📚 *Série Pretendida:* ${encodeURIComponent(grade)}%0A` +
                      `👨‍👩‍👧 *Responsável:* ${encodeURIComponent(parentName)}%0A` +
                      `📞 *Telefone para Contato:* ${encodeURIComponent(phone)}`;

  window.open(`https://wa.me/${schoolPhone}?text=${textMessage}`, '_blank');
};

/* ==========================================================================
   6. INTELIGÊNCIA ARTIFICIAL E CHAT
   ========================================================================== */
window.askMatriculaIA = function() {
  const input = document.getElementById('matChatInput');
  const question = input?.value.trim();
  if (!question) return;

  const chatLogs = document.getElementById('matChatLogs');
  appendMessage(chatLogs, 'user', question);
  input.value = '';

  setTimeout(() => {
    const qLower = question.toLowerCase();
    let reply = "Para fazer a matrícula pública no C.E.I.A.S, preencha o formulário ao lado que nossa secretaria entrará em contato!";

    if (qLower.includes('doc') || qLower.includes('documento') || qLower.includes('trazer')) {
      reply = "📄 Documentos Necessários: RG/Certidão do aluno, CPF dos responsáveis, Comprovante de Residência rural e Histórico Escolar.";
    } else if (qLower.includes('paga') || qLower.includes('valor') || qLower.includes('custo')) {
      reply = "🆓 O C.E.I.A.S é uma escola 100% pública e gratuita!";
    }

    appendMessage(chatLogs, 'bot', reply);
  }, 500);
};

window.sendMainChatMessage = function() {
  const input = document.getElementById('mainChatInput');
  const messageText = input?.value.trim();
  if (!messageText) return;

  const chatLogs = document.getElementById('mainChatLogs');
  appendMessage(chatLogs, 'user', messageText);
  chatHistory.push(`Usuário: ${messageText}`);
  input.value = '';

  setTimeout(() => {
    const text = messageText.toLowerCase();
    let botReply = "Entendido! Se quiser falar diretamente com a equipe da escola, clique no botão verde abaixo para enviar esta conversa para o WhatsApp.";

    if (text.includes('horario') || text.includes('turnos')) {
      botReply = "⏰ Aulas no Matutino (07h30 às 11h50) e Vespertino (13h00 às 17h20).";
    } else if (text.includes('irma ambrosia') || text.includes('historia')) {
      botReply = "⛪ Nossa escola possui origem em valores católicos em homenagem à Irmã Ambrósia Sabatovich e com o lema 'Educando para a Comunidade'.";
    }

    appendMessage(chatLogs, 'bot', botReply);
    chatHistory.push(`IA C.E.I.A.S: ${botReply}`);
  }, 500);
};

window.exportChatToWhatsApp = function() {
  if (chatHistory.length === 0) return;

  const schoolPhone = "5500999998888";
  const formattedLogs = chatHistory.join("%0A");
  const fullText = `Olá! Estava no site do C.E.I.A.S e gostaria de continuar o atendimento:%0A%0A` + formattedLogs;

  window.open(`https://wa.me/${schoolPhone}?text=${fullText}`, '_blank');
};

function appendMessage(container, sender, text) {
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;
  msgDiv.innerText = text;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}