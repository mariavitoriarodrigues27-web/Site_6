/**
 * C.E.I.A.S - Colégio do Campo Irmã Ambrósia Sabatovich
 * Script Principal de Interatividade, Acessibilidade e Inteligência Artificial
 */

// REGISTRO DE HISTÓRICO DE CONVERSA DO CHAT PRINCIPAL
let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  initHamburgerMenu();
  initFormListeners();
  animateChartBars();
});

/* ==========================================================================
   1. MENU NAVEGAÇÃO & HAMBÚRGUER (MOBILE)
   ========================================================================== */
function initHamburgerMenu() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      hamburgerBtn.classList.toggle('active');
    });

    // Fechar o menu ao clicar fora dele
    document.addEventListener('click', (event) => {
      if (!navMenu.contains(event.target) && !hamburgerBtn.contains(event.target)) {
        navMenu.classList.remove('open');
        hamburgerBtn.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   2. SISTEMA DE NAVEGAÇÃO POR ABAS COM ANIMAÇÃO
   ========================================================================== */
window.switchTab = function(event, tabId) {
  const allPanes = document.querySelectorAll('.tab-pane');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const targetPane = document.getElementById(tabId);

  if (!targetPane) return;

  // Remover classes ativas anteriores
  allPanes.forEach(pane => {
    pane.classList.remove('active');
    pane.style.opacity = '0';
  });

  allNavLinks.forEach(link => link.classList.remove('active'));

  // Activar a aba pretendida
  targetPane.classList.add('active');
  setTimeout(() => {
    targetPane.style.opacity = '1';
  }, 50);

  if (event && event.currentTarget) {
    event.currentTarget.classList.add('active');
  }

  // Fechar menu hambúrguer no mobile
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.remove('open');

  // Rolar suavemente para o topo do conteúdo
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-animar barras do gráfico se for a aba de ensino
  if (tabId === 'ensino') {
    animateChartBars();
  }
};

/* ==========================================================================
   3. FERRAMENTAS DE ACESSIBILIDADE
   ========================================================================== */
window.toggleContrast = function() {
  document.body.classList.toggle('high-contrast');
  const isHigh = document.body.classList.contains('high-contrast');
  showToast(isHigh ? "Modo Alto Contraste Ativado" : "Modo Padrão Ativado");
};

let fontScale = 100;
window.adjustFont = function(direction) {
  fontScale += direction * 5;
  if (fontScale < 85) fontScale = 85;
  if (fontScale > 125) fontScale = 125;
  
  document.body.style.fontSize = `${fontScale}%`;
  showToast(`Tamanho da Fonte: ${fontScale}%`);
};

/* ==========================================================================
   4. FORMULÁRIO DE PRÉ-MATRÍCULA & WHATSAPP
   ========================================================================== */
function initFormListeners() {
  const matForm = document.querySelector('.form-box');
  if (matForm) {
    matForm.addEventListener('submit', window.processMatricula);
  }

  // Permite enviar mensagens no chat ao pressionar a tecla 'Enter'
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

  if (!studentName || !grade || !parentName || !phone) {
    showToast("Por favor, preencha todos os campos do formulário!");
    return;
  }

  const schoolPhone = "5500999998888"; // Substituir pelo número real da escola
  const textMessage = `Olá! Gostaria de encaminhar a solicitação de pré-matrícula pública no *C.E.I.A.S*:%0A%0A` +
                      `👤 *Aluno(a):* ${encodeURIComponent(studentName)}%0A` +
                      `📚 *Série Pretendida:* ${encodeURIComponent(grade)}%0A` +
                      `👨‍👩‍👧 *Responsável:* ${encodeURIComponent(parentName)}%0A` +
                      `📞 *Telefone para Contato:* ${encodeURIComponent(phone)}%0A%0A` +
                      `Aguardamos o retorno da Secretaria do Colégio.`;

  window.open(`https://wa.me/${schoolPhone}?text=${textMessage}`, '_blank');
  showToast("Redirecionando para o WhatsApp da Secretaria...");
};

/* ==========================================================================
   5. IA DA ABA DE MATRÍCULA (MINI ASSISTENTE)
   ========================================================================== */
window.askMatriculaIA = function() {
  const input = document.getElementById('matChatInput');
  const question = input?.value.trim();
  if (!question) return;

  const chatLogs = document.getElementById('matChatLogs');
  appendMessage(chatLogs, 'user', question);
  input.value = '';

  // Efeito de resposta do assistente inteligente
  showTypingIndicator(chatLogs, () => {
    const qLower = question.toLowerCase();
    let reply = "Para concluir a pré-matrícula, preencha os dados no formulário ao lado que nossa secretaria entrará em contato!";

    if (qLower.includes('doc') || qLower.includes('documento') || qLower.includes('trazer') || qLower.includes('precisa')) {
      reply = "📄 *Documentos Necessários:* RG/Certidão de Nascimento do aluno, CPF dos responsáveis, Comprovante de Residência rural e Histórico Escolar original.";
    } else if (qLower.includes('paga') || qLower.includes('valor') || qLower.includes('custo') || qLower.includes('mensalidade')) {
      reply = "🆓 O C.E.I.A.S é uma instituição **100% pública e gratuita**. Não há cobrança de taxas de matrícula ou mensalidades.";
    } else if (qLower.includes('transporte') || qLower.includes('ônibus') || qLower.includes('bus')) {
      reply = "🚌 Disponibilizamos transporte escolar rural gratuito que atende as principais rotas da nossa região.";
    }

    appendMessage(chatLogs, 'bot', reply);
  });
};

/* ==========================================================================
   6. CHATBOT COMPLETO DA ESCOLA & ENCAMINHAMENTO WHATSAPP
   ========================================================================== */
window.sendMainChatMessage = function() {
  const input = document.getElementById('mainChatInput');
  const messageText = input?.value.trim();
  if (!messageText) return;

  const chatLogs = document.getElementById('mainChatLogs');
  appendMessage(chatLogs, 'user', messageText);
  chatHistory.push(`Usuário: ${messageText}`);
  input.value = '';

  showTypingIndicator(chatLogs, () => {
    const text = messageText.toLowerCase();
    let botReply = "Entendi perfeitamente! Se quiser falar diretamente com nossa equipe pedagógica ou diretoria, clique no botão verde abaixo para enviar esta conversa ao WhatsApp oficial do colégio.";

    if (text.includes('horario') || text.includes('turnos') || text.includes('horas')) {
      botReply = "⏰ *Horários das Aulas:*\n• Turno Matutino: 07h30 às 11h50\n• Turno Vespertino: 13h00 às 17h20";
    } else if (text.includes('irma ambrosia') || text.includes('historia') || text.includes('fundacao') || text.includes('catolica')) {
      botReply = "⛪ Nossa escola possui origem em valores comunitários católicos em homenagem à Irmã Ambrósia Sabatovich, focando no acolhimento, ética e na valorização da vida no campo.";
    } else if (text.includes('disciplina') || text.includes('materia') || text.includes('ensino')) {
      botReply = "📖 O C.E.I.A.S atende do 6º ao 9º ano (Fundamental II) e do 1º ao 3º ano (Ensino Médio), incluindo disciplinas tradicionais e Itinerários Formativos do Campo.";
    } else if (text.includes('acessibilidade') || text.includes('deficiencia') || text.includes('rampa')) {
      botReply = "♿ Nossa infraestrutura conta com rampas de acesso, sanitários adaptados, dependências com acessibilidade total e recursos inclusivos para todos os estudantes.";
    }

    appendMessage(chatLogs, 'bot', botReply);
    chatHistory.push(`IA C.E.I.A.S: ${botReply}`);
  });
};

window.exportChatToWhatsApp = function() {
  if (chatHistory.length === 0) {
    showToast("Inicie uma conversa no chat primeiro!");
    return;
  }

  const schoolPhone = "5500999998888";
  const formattedLogs = chatHistory.join("%0A");
  const fullText = `Olá! Estava no site oficial do *C.E.I.A.S* e gostaria de dar continuidade ao atendimento com a secretaria:%0A%0A` + formattedLogs;

  window.open(`https://wa.me/${schoolPhone}?text=${fullText}`, '_blank');
};

/* ==========================================================================
   7. FUNÇÕES AUXILIARES & EFEITOS VISUAIS
   ========================================================================== */
function appendMessage(container, sender, text) {
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${sender}`;
  msgDiv.innerHTML = text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator(container, callback) {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'msg bot typing-indicator';
  typingDiv.innerText = "A IA está digitando...";
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    typingDiv.remove();
    if (callback) callback();
  }, 600);
}

function animateChartBars() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    const originalWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
      bar.style.width = originalWidth;
    }, 100);
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: #0284c7;
      color: #ffffff;
      padding: 12px 22px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.88rem;
      box-shadow: 0 10px 25px rgba(2, 132, 199, 0.3);
      z-index: 10000;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3000);
}