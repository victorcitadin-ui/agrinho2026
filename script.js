// Banco de dados com as informações de cada papel
const roleData = {
    comandante: "<strong>Perspectiva do Porto:</strong> Como uma superpotência verde, o Porto de Paranaguá monitora constantemente a qualidade da água, do ar e a vida marinha. A tecnologia é usada para movimentar milhões de toneladas de grãos reduzindo ao máximo a pegada de carbono e os impactos ambientais.",
    agricultor: "<strong>Perspectiva do Campo:</strong> A produção regional (como a banana, a pupunha e a agricultura familiar) foca em técnicas de manejo que protegem o solo. Garantir que a lavoura seja limpa significa que a água que corre para os rios e chega até a baía continuará cheia de vida.",
    guardiao: "<strong>Perspectiva da Natureza:</strong> Os botos-cinza, os manguezais e os pescadores tradicionais são os termômetros da região. O futuro sustentável só existe se o crescimento econômico respeitar o ecossistema e gerar inclusão para as comunidades locais."
};

// Seleção dos elementos do HTML
const buttons = document.querySelectorAll('.role-btn');
const contentBox = document.getElementById('role-content');

// Adiciona o evento de clique em cada um dos botões
buttons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedRole = this.getAttribute('data-role');
        
        // Efeito de transição suavizando o sumiço do texto antigo
        contentBox.style.opacity = 0;
        
        setTimeout(() => {
            // Altera o texto baseado no botão clicado
            contentBox.innerHTML = roleData[selectedRole];
            // Suaviza o surgimento do novo texto
            contentBox.style.opacity = 1;
        }, 200);

        // Remove a classe 'active' de todos os botões e adiciona apenas no clicado
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});