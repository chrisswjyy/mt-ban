// JavaScript untuk Promote Generator
// API Key Gemini (ganti dengan API key yang valid)
const GEMINI_API_KEY = 'AIzaSyChnFkWvBb-KeF9roqpoGa51cjZI5TZrI4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Mapping bahasa untuk prompt template
const languageTemplates = {
    indonesia: {
        template: `Kalian mau belanja digital? tapi gatau belanja dimana? di Trust Fame aja! Trust Fame menjual segala solusi digital di website {website} kamu bisa beli semua produk digital jangan lupa ikutin {promotor} yaa`,
        shopPhrase: "mau belanja digital",
        confusedPhrase: "tapi gatau belanja dimana",
        solutionPhrase: "di Trust Fame aja",
        descriptionPhrase: "Trust Fame menjual segala solusi digital",
        actionPhrase: "kamu bisa beli semua produk digital",
        followPhrase: "jangan lupa ikutin"
    },
    malaysia: {
        template: `Korang nak beli barang digital? tapi tak tahu nak beli kat mana? kat Trust Fame je lah! Trust Fame jual semua penyelesaian digital di website {website} korang boleh beli semua produk digital jangan lupa follow {promotor} ye`,
        shopPhrase: "nak beli barang digital",
        confusedPhrase: "tapi tak tahu nak beli kat mana",
        solutionPhrase: "kat Trust Fame je lah",
        descriptionPhrase: "Trust Fame jual semua penyelesaian digital",
        actionPhrase: "korang boleh beli semua produk digital",
        followPhrase: "jangan lupa follow"
    },
    jepang: {
        template: `デジタル商品を買いたいですか？でもどこで買えばいいかわからない？Trust Fameで買いましょう！Trust Fameは{website}でデジタルソリューションを全て販売しています。全てのデジタル商品を購入できます。{promotor}をフォローすることを忘れないでください`,
        shopPhrase: "デジタル商品を買いたいですか",
        confusedPhrase: "でもどこで買えばいいかわからない",
        solutionPhrase: "Trust Fameで買いましょう",
        descriptionPhrase: "Trust Fameはデジタルソリューションを全て販売しています",
        actionPhrase: "全てのデジタル商品を購入できます",
        followPhrase: "をフォローすることを忘れないでください"
    },
    korea: {
        template: `디지털 상품을 사고 싶으세요? 하지만 어디서 사야 할지 모르겠나요? Trust Fame에서 사세요! Trust Fame은 {website}에서 모든 디지털 솔루션을 판매합니다. 모든 디지털 제품을 구매할 수 있습니다. {promotor}를 팔로우하는 것을 잊지 마세요`,
        shopPhrase: "디지털 상품을 사고 싶으세요",
        confusedPhrase: "하지만 어디서 사야 할지 모르겠나요",
        solutionPhrase: "Trust Fame에서 사세요",
        descriptionPhrase: "Trust Fame은 모든 디지털 솔루션을 판매합니다",
        actionPhrase: "모든 디지털 제품을 구매할 수 있습니다",
        followPhrase: "를 팔로우하는 것을 잊지 마세요"
    },
    spanyol: {
        template: `¿Quieres comprar productos digitales? ¿pero no sabes dónde comprar? ¡en Trust Fame! Trust Fame vende todas las soluciones digitales en el sitio web {website} puedes comprar todos los productos digitales no olvides seguir a {promotor}`,
        shopPhrase: "¿Quieres comprar productos digitales",
        confusedPhrase: "¿pero no sabes dónde comprar",
        solutionPhrase: "¡en Trust Fame",
        descriptionPhrase: "Trust Fame vende todas las soluciones digitales",
        actionPhrase: "puedes comprar todos los productos digitales",
        followPhrase: "no olvides seguir a"
    },
    brazil: {
        template: `Olá WhatsApp 👉{website}🪭 🎰🔥

💎 O maior e mais confiável site de Slots Online está aqui para você! 💎
🌟 Ganhe bônus gigantescos, giros grátis 🎁 e jackpots 💰 que podem mudar sua vida!
⚡ Jogos rápidos, pagamentos instantâneos e atendimento VIP 24h 🕐

🎯 Não perca mais tempo! Centenas de jogadores já estão ganhando todos os dias 🏆
📈 Aumente suas chances de vitória agora mesmo — cadastre-se e jogue!
https://api.whatsapp.com/sent?phone=+{nomorpromotor}

💥 Venha fazer parte do mundo dos vencedores 🎉
🎮 Slots 🎲 Cassino 🎯 Apostas esportivas
💳 Depósito & saque super rápidos via PIX 🚀
https://api.whatsapp.com/sent?phone=+{nomorpromotor}

👉 Clique já no link e comece sua sorte hoje: {website}/🪭
💖 A sorte está te esperando! 🍀

#{promotor} #markzuckerbe ygrgSlot 🪭
# slotgacor #Mekz #situsgacor #situsbandarslot🪭 {promotor}`,
        shopPhrase: "Vocês querem comprar produtos digitais",
        confusedPhrase: "mas não sabem onde comprar",
        solutionPhrase: "na Trust Fame",
        descriptionPhrase: "Trust Fame vende todas as soluções digitais",
        actionPhrase: "vocês podem comprar todos os produtos digitais",
        followPhrase: "não esqueçam de seguir"
    }
};

// DOM Elements
const websiteInput = document.getElementById('website');
const languageSelect = document.getElementById('language');
const promotorInput = document.getElementById('promotor');
const nomorPromotorInput = document.getElementById('nomorPromotor');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');
const resultSection = document.getElementById('result');
const generatedText = document.getElementById('generatedText');
const copyBtn = document.getElementById('copyBtn');
const errorSection = document.getElementById('error');
const errorText = document.getElementById('errorText');

// Event Listeners
generateBtn.addEventListener('click', generatePromoText);
copyBtn.addEventListener('click', copyToClipboard);

// Validate URL format
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorSection.classList.remove('hidden');
    resultSection.classList.add('hidden');
}

// Hide error message
function hideError() {
    errorSection.classList.add('hidden');
}

// Show loading state
function showLoading() {
    generateBtn.disabled = true;
    btnText.classList.add('hidden');
    loading.classList.remove('hidden');
}

// Hide loading state
function hideLoading() {
    generateBtn.disabled = false;
    btnText.classList.remove('hidden');
    loading.classList.add('hidden');
}

// Create AI prompt for generating promotional text
function createPrompt(website, language, promotor, nomorPromotor) {
    const template = languageTemplates[language];
    
    const prompt = `Kamu adalah seorang penjudi berat . Buatkan text promosi yang menarik dan memancing untuk website judi dengan format berikut:

Website: ${website}
Bahasa: ${language}
Nama Promotor: ${promotor}
Nomor Promotor: ${nomorPromotor}

Template dasar yang harus diikuti tapi bisa dikembangkan lebih kreatif:
"${template.template}"

Instruksi:
1. Ganti {website} dengan: ${website}
2. Ganti {promotor} dengan: ${promotor}
3. Buat text judi yang lebih menarik dan persuasif
4. Tambahkan emoji yang berhubungan dengan uang
5. kamu seorang tukang promosi judi yang kuat
6. buat 1 teks setiap promosi tapi buat langsung memancing target dan buat 500.kalimat
7. Gunakan gaya bahasa ${language} yang memancing agar mereka ikut bejudi
8. Fokus pada Tujuan kamu yang harus mempromosikan judi
9. kamu bisa merubah sedikit kata katanya agar tidak terlihat sama, gunakan emoji 💎🎰🎲💰
10. buat mereka kecanduan oleh text judi yang kau promosikan
11. kamu hanya mempromosikan bahasa brazil
12. kamu selalu membawa nama mark zuckerberg karena dia selalu menang judi


Buatkan 1 versi text promosi judi yang sempurna dan memancing!
`;

    return prompt;
}

// Generate promotional text using Gemini API
async function generatePromoText() {
    // Validate inputs
    const website = websiteInput.value.trim();
    const language = languageSelect.value;
    const promotor = promotorInput.value.trim();
    const nomorPromotor = nomorPromotorInput.value.trim();

    if (!website || !language || !promotor || !nomorPromotor) {
        showError('Mohon lengkapi semua field!');
        return;
    }

    if (!isValidUrl(website)) {
        showError('Format URL website tidak valid! Contoh: https://example.com');
        return;
    }

    hideError();
    showLoading();

    try {
        // Create prompt
        const prompt = createPrompt(website, language, promotor, nomorPromotor);

        // API request payload
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.9,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        // Make API call
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const generatedContent = data.candidates[0].content.parts[0].text;
            displayResult(generatedContent);
        } else {
            throw new Error('Tidak ada response dari AI. Coba lagi!');
        }

    } catch (error) {
        console.error('Error:', error);
        showError(`Gagal generate text: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Display the generated result
function displayResult(text) {
    generatedText.textContent = text;
    resultSection.classList.remove('hidden');
}

// Copy text to clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(generatedText.textContent);
        
        // Change button text temporarily
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied! ✓';
        copyBtn.style.background = '#38a169';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#48bb78';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = generatedText.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.textContent = 'Copied! ✓';
        setTimeout(() => {
            copyBtn.textContent = 'Copy Text';
        }, 2000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Promote Generator AI loaded successfully!');
    
    // Add enter key support for inputs
    [websiteInput, promotorInput, nomorPromotorInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generatePromoText();
            }
        });
    });
    
    // Add change listener for language select
    languageSelect.addEventListener('change', hideError);
});