/**
 * custom.js
 * Contains global logic for PDF Modal Viewer, Chatbot UI, and About page Carousel
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject PDF Modal HTML
    const pdfModalHTML = `
        <div class="global-pdf-modal" id="globalPdfModal">
            <div class="global-pdf-overlay" id="globalPdfOverlay"></div>
            <div class="global-pdf-content">
                <div class="global-pdf-header">
                    <span class="global-pdf-title" id="globalPdfTitle">문서 뷰어</span>
                    <button class="global-pdf-close" id="globalPdfClose" aria-label="닫기">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <iframe class="global-pdf-iframe" id="globalPdfIframe" src=""></iframe>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', pdfModalHTML);

    const pdfModal = document.getElementById('globalPdfModal');
    const pdfIframe = document.getElementById('globalPdfIframe');
    const pdfTitle = document.getElementById('globalPdfTitle');
    
    function openPdfModal(url, title = '문서 뷰어') {
        let viewerUrl = url;
        // Force PDF files to open inside custom PageFlip viewer ebook.html
        if (!url.startsWith('ebook.html') && url.toLowerCase().endsWith('.pdf')) {
            viewerUrl = 'ebook.html?file=' + encodeURIComponent(url);
        }
        pdfIframe.src = viewerUrl;
        pdfTitle.textContent = title;
        pdfModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePdfModal() {
        pdfModal.classList.remove('active');
        pdfIframe.src = '';
        document.body.style.overflow = '';
    }

    document.getElementById('globalPdfClose').addEventListener('click', closePdfModal);
    document.getElementById('globalPdfOverlay').addEventListener('click', closePdfModal);

    // Override PDF links
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        // If it links to ebook.html?file=... or directly to a PDF and is not a download link
        if ((href.includes('ebook.html?file=') || href.toLowerCase().endsWith('.pdf')) && !link.hasAttribute('download')) {
            // Except the NotebookLM link if it matches
            if (href.includes('notebooklm.google.com')) return;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let pdfUrl = href;
                if (href.includes('ebook.html?file=')) {
                    pdfUrl = decodeURIComponent(href.split('file=')[1]);
                }
                const title = link.textContent.trim() || '비에이텍 문서';
                openPdfModal(pdfUrl, title);
            });
        }
    });

    // 2. Inject Chatbot HTML
    const chatbotHTML = `
        <div class="chatbot-wrapper">
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <i data-lucide="bot" style="width: 24px; height: 24px; color: white;"></i>
                        <div>
                            <div class="chatbot-header-title">비에이텍 기술지원 AI</div>
                            <div class="chatbot-header-sub">유지관리 지침서 기반 답변</div>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i data-lucide="chevron-down"></i>
                    </button>
                </div>
                <div class="chatbot-body" id="chatbotBody">
                    <div class="chat-bubble bot">
                        안녕하세요! (주)비에이텍 기술지원 AI입니다. 펌프 유지관리 및 문제 해결에 대해 질문해주세요. (예: 다이아프램, 에어 빼기, 소음, 유량 조절 등)
                    </div>
                </div>
                <div class="chatbot-input-area">
                    <input type="text" class="chatbot-input" id="chatbotInput" placeholder="질문을 입력하세요..." />
                    <button class="chatbot-send" id="chatbotSend">
                        <i data-lucide="send" style="width: 18px; height: 18px;"></i>
                    </button>
                </div>
            </div>
            <div class="chatbot-toggle" id="chatbotToggle">
                <i data-lucide="message-circle" style="width: 28px; height: 28px;"></i>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotBody = document.getElementById('chatbotBody');

    function toggleChatbot() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatbotInput.focus();
        }
    }

    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);

    // Mock AI Logic based on "정량펌프 유지관리지침서" context
    function getMockResponse(query) {
        query = query.toLowerCase();
        
        if (query.includes('다이아프램') || query.includes('막') || query.includes('파손')) {
            return "<b>[다이아프램(막) 점검 및 교체]</b><br>" +
                   "다이아프램이 파손되면 약액이 기어실로 혼입되어 펌프 고장이나 오일 오염을 유발합니다.<br>" +
                   "1. <b>교체 주기</b>: 가동 1년 또는 4,000시간을 권장합니다.<br>" +
                   "2. <b>조치 사항</b>: 파손 시 다이아프램을 즉시 교체하고, 오일 챔버를 세척한 후 오일을 재주입해야 합니다. 가압부 기밀 상태를 반드시 확인하십시오.";
        }
        
        if (query.includes('흡입') || query.includes('토출') || query.includes('양 부족') || query.includes('안나와') || query.includes('나오지')) {
            return "<b>[토출 불량 / 흡입 불능 원인 및 대책]</b><br>" +
                   "정량펌프의 약액 토출량이 부족하거나 흡입이 안 될 경우 다음을 점검하십시오:<br>" +
                   "1. <b>체크밸브 오염</b>: 밸브 내 볼(Ball)과 시트(Seat)에 이물질/슬러지가 끼었는지 확인 후 세척하십시오.<br>" +
                   "2. <b>배관 기밀</b>: 흡입 배관의 이음새로 에어가 혼입되는지(기밀 불량) 점검하십시오.<br>" +
                   "3. <b>여과기 막힘</b>: 흡입측 스트레이너가 약액 고형물로 막혔는지 세척을 권장합니다.";
        }
        
        if (query.includes('에어') || query.includes('공기') || query.includes('벤팅') || query.includes('기포')) {
            return "<b>[에어 빼기(Air Venting) 작업]</b><br>" +
                   "배관 내에 에어가 차면 펌프 압축비가 떨어져 약액이 흡입되지 않습니다.<br>" +
                   "1. <b>조치 방법</b>: 펌프 토출측에 연결된 에어 벤트 밸브를 열어 기포가 완전히 제거되고 약액이 연속적으로 흘러나올 때까지 공기를 방출시키십시오.<br>" +
                   "2. <b>주의</b>: 약액이 흘러나올 때 비산하지 않도록 수집 용기를 대고 가동하십시오.";
        }
        
        if (query.includes('스트로크') || query.includes('다이얼') || query.includes('유량 조절')) {
            return "<b>[스트로크(Stroke) 조절 유의사항]</b><br>" +
                   "정량펌프의 유량 미세 조절 시 기구부 보호를 위해 지침을 준수해야 합니다.<br>" +
                   "1. <b>조절 타이밍</b>: 스트로크 조절 다이얼은 반드시 <b>펌프가 가동 중인 상태</b>에서 돌려야 내부 조절 기구(캠/크랭크)의 기계적 무리를 예방할 수 있습니다. 정지 상태에서 강제로 돌리지 마십시오.<br>" +
                   "2. <b>고정</b>: 유량 조절 후 잠금 나사를 확실히 고정해 유량 편차를 방지하십시오.";
        }
        
        if (query.includes('체크밸브') || query.includes('밸브')) {
            return "<b>[체크밸브(Check Valve) 유지보수]</b><br>" +
                   "정량펌프의 일방향 흐름을 유지하는 핵심 부품입니다.<br>" +
                   "1. <b>구조 점검</b>: 볼(Ball), 가이드, 시트(Seat), O링 패킹 순서로 조립됩니다. 분해 후 조립 시 역방향(화살표 방향 반대)으로 조립되지 않도록 주의하십시오.<br>" +
                   "2. <b>소모품</b>: O링과 테프론 패킹은 분해 조립 시 신품 교체를 원칙으로 합니다.";
        }
        
        if (query.includes('오일') || query.includes('윤활유') || query.includes('기어유') || query.includes('교환')) {
            return "<b>[오일(윤활유) 교환 기준]</b><br>" +
                   "기어 챔버 오일은 펌프 수명과 직결됩니다.<br>" +
                   "1. <b>최초 교환</b>: 신규 가동 후 500시간 경과 시 기어 마찰 금속분 제거를 위해 1차 오일 교환을 실시하십시오.<br>" +
                   "2. <b>정기 교환</b>: 이후 매 3,000시간 또는 6개월 주기로 교체하십시오.<br>" +
                   "3. <b>권장 규격</b>: 공업용 극압 기어유 ISO VG 220 규격을 사용하십시오.";
        }
        
        if (query.includes('소음') || query.includes('진동')) {
            return "<b>[소음 및 진동 이상 상태]</b><br>" +
                   "펌프에서 비정상적인 소음이나 진동이 감지될 경우:<br>" +
                   "1. <b>체크 사항</b>: 모터 베어링 마모, 커플링 정렬(Alignment) 틀어짐, 혹은 배관 맥동 현상(에어 챔버 충전 압력 저하)을 점검하십시오.<br>" +
                   "2. <b>안전 조치</b>: 즉시 가동을 정지하고 조작반 전원을 차단한 후 현장 관리자 및 엔지니어에게 점검을 요청해 주십시오.";
        }
        
        if (query.includes('중단') || query.includes('정지') || query.includes('에러') || query.includes('알람')) {
            return "<b>[갑작스러운 정지 및 에러 해결]</b><br>" +
                   "펌프 제어반의 알람 발생 시 대책:<br>" +
                   "1. <b>과전류 차단(EOCR)</b>: 모터 부하 과중이나 이물질 고착으로 트립되었을 수 있으니 점검 후 리셋하십시오.<br>" +
                   "2. <b>공전 방지(Dry Run)</b>: 공급 약액이 소모되어 액 레벨 센서 감지로 멈춘 것인지 액 탱크 수위를 확인하십시오.";
        }
        
        if (query.includes('비에이텍') || query.includes('안녕') || query.includes('도움')) {
            return "안녕하세요! (주)비에이텍 기술지원 AI입니다. 펌프 소음, 다이아프램, 에어 빼기, 스트로크 조절, 오일 교환 등 유지관리 지침서에 기재된 어떤 사항이든 물어보세요.";
        }
        
        return "입력하신 질문에 대해 매뉴얼 내 특정 키워드를 매칭하지 못했습니다. 상세한 유지보수 지원은 비에이텍 기술센터(033-264-9243) 또는 직원전용 자료실(NotebookLM)을 참고하시기 바랍니다.";
    }

    function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        // User Message
        chatbotBody.insertAdjacentHTML('beforeend', `<div class="chat-bubble user">${text}</div>`);
        chatbotInput.value = '';
        chatbotBody.scrollTop = chatbotBody.scrollHeight;

        // Bot typing simulation
        setTimeout(() => {
            const response = getMockResponse(text);
            chatbotBody.insertAdjacentHTML('beforeend', `<div class="chat-bubble bot">${response}</div>`);
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 600);
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // 3. Carousel Logic for about.html
    const carouselSlides = document.getElementById('aboutCarousel');
    if (carouselSlides) {
        const slides = carouselSlides.children;
        const totalSlides = slides.length;
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsContainer = document.getElementById('carouselIndicators');
        let currentIndex = 0;
        let slideInterval = null;

        function updateCarousel() {
            carouselSlides.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (dotsContainer) {
                const dots = dotsContainer.children;
                for (let i = 0; i < dots.length; i++) {
                    if (i === currentIndex) {
                        dots[i].classList.add('active');
                    } else {
                        dots[i].classList.remove('active');
                    }
                }
            }
        }

        function showNextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        function showPrevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showNextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showPrevSlide();
                resetAutoplay();
            });
        }

        if (dotsContainer) {
            dotsContainer.addEventListener('click', (e) => {
                const dot = e.target.closest('.carousel-dot');
                if (dot) {
                    const idx = parseInt(dot.getAttribute('data-index'), 10);
                    currentIndex = idx;
                    updateCarousel();
                    resetAutoplay();
                }
            });
        }

        function startAutoplay() {
            slideInterval = setInterval(showNextSlide, 4500);
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        startAutoplay();
    }

    // Re-initialize lucide icons for dynamically added elements
    if (window.lucide) {
        lucide.createIcons();
    }
});
