import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { AppScreen, UserProfile, Workout, Recipe, DailyTip, Badge, MindsetItem, JournalEntry, RecipeCategory } from '../types';

// --- CONSTANTS ---
const BADGES: Badge[] = [
  { id: 'start', title: 'O Início', description: 'Começou sua jornada', icon: '🚀', color: 'bg-blue-500' },
  { id: 'loss_1', title: 'Primeiro Passo', description: 'Perdeu 1kg', icon: '💧', color: 'bg-cyan-500' },
  { id: 'loss_5', title: 'Imparável', description: 'Perdeu 5kg', icon: '🔥', color: 'bg-orange-500' },
  { id: 'loss_10', title: 'Transformação', description: 'Perdeu 10kg', icon: '💎', color: 'bg-pink-500' },
  { id: 'goal', title: 'Meta Atingida', description: 'Alcançou o peso ideal', icon: '🏆', color: 'bg-yellow-500' },
];

const DAILY_TIPS: DailyTip[] = [
    { id: '1', category: 'Mindset', title: 'Consistência > Intensidade', content: 'Não tente fazer tudo perfeito hoje. Apenas apareça.' },
    { id: '2', category: 'Nutrição', title: 'O poder da Proteína', content: 'Incluir proteína no café da manhã reduz os desejos de açúcar em até 60%.' },
    { id: '3', category: 'Hidratação', title: 'Beba antes de comer', content: 'Muitas vezes confundimos sede com fome. Beba água antes das refeições.' },
];

const MOCK_MINDSET: MindsetItem[] = [
    { 
        id: 'm1', 
        title: "Mindset de Sucesso", 
        description: "Aprenda a configurar sua mente para vencer os obstáculos diários e manter o foco no longo prazo.",
        duration: "10 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800"
    },
    { 
        id: 'm2', 
        title: "Superando a Ansiedade", 
        description: "Técnicas práticas para reduzir a ansiedade e evitar que o estresse atrapalhe seu progresso físico.",
        duration: "12 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1499209974431-276138d71626?q=80&w=800"
    },
    { 
        id: 'm3', 
        title: "A Disciplina do Descanso", 
        description: "Por que dormir e descansar é tão importante quanto treinar para a queima de gordura.",
        duration: "8 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1511295742362-92c96b50484a?q=80&w=800"
    },
    { 
        id: 'm4', 
        title: "Por que não precisamos de academia?", 
        description: "Entenda a ciência por trás do treino com peso do corpo e como ter resultados superiores em casa.",
        duration: "15 min", 
        type: "Vídeo", 
        completed: false,
        video_url: "", // COLE O LINK DO YOUTUBE AQUI
        thumbnail_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800"
    },
];

const generateRecipes = (): Recipe[] => {
    const categories: { cat: RecipeCategory; baseImg: string; templates: any[] }[] = [
        { 
            cat: 'Café da Manhã', 
            baseImg: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=800',
            templates: [
                { 
                    t: 'Panqueca de Banana e Aveia', 
                    cal: 280, 
                    tags: ['Vegetariano', 'Sem Glúten'], 
                    ing: ['1 banana prata madura', '2 ovos médios', '2 colheres (sopa) de farelo de aveia', '1 pitada de canela em pó', 'Óleo de coco para untar'], 
                    inst: ['Em uma tigela pequena, amasse bem a banana com um garfo.', 'Adicione os ovos e bata até obter uma mistura homogênea.', 'Acrescente o farelo de aveia e a canela, misturando bem.', 'Aqueça uma frigideira antiaderente em fogo baixo e unte levemente com óleo de coco.', 'Despeje a massa formando pequenos discos.', 'Deixe dourar por cerca de 2 minutos de cada lado e sirva quente.']
                },
                { 
                    t: 'Ovos Mexidos Cremosos', 
                    cal: 220, 
                    tags: ['Low Carb', 'Sem Glúten'], 
                    ing: ['2 ovos grandes', '1 colher (sopa) de requeijão light ou creme de ricota', 'Cebolinha picada a gosto', 'Sal e Pimenta do reino a gosto', '1 fio de azeite'], 
                    inst: ['Em um bowl, bata os ovos ligeiramente com um garfo.', 'Tempere com sal e pimenta.', 'Aqueça o azeite em uma frigideira antiaderente em fogo baixo.', 'Despeje os ovos e mexa suavemente com uma espátula, trazendo as bordas para o centro.', 'Quando estiverem quase cozidos, mas ainda úmidos, desligue o fogo.', 'Misture o requeijão rapidamente para dar cremosidade.', 'Finalize com a cebolinha picada e sirva.']
                },
                { 
                    t: 'Smoothie Verde Detox', 
                    cal: 150, 
                    tags: ['Vegano', 'Sem Lactose'], 
                    ing: ['1 folha de couve manteiga (sem o talo)', '1 maçã verde pequena com casca', '1 rodela fina de gengibre', '200ml de água de coco gelada', 'Suco de 1/2 limão'], 
                    inst: ['Lave bem a couve e a maçã.', 'Pique a maçã em cubos, removendo as sementes.', 'Coloque todos os ingredientes no liquidificador.', 'Bata na velocidade máxima até obter uma bebida homogênea e sem pedaços.', 'Beba imediatamente para aproveitar todos os nutrientes (não precisa coar).']
                },
                { 
                    t: 'Mingau de Aveia Proteico', 
                    cal: 320, 
                    tags: ['Vegetariano'], 
                    ing: ['30g de aveia em flocos finos', '1 scoop de whey protein (sabor baunilha ou chocolate)', '200ml de leite desnatado ou vegetal', 'Morangos ou mirtilos para decorar'], 
                    inst: ['Em uma panela pequena, misture a aveia e o leite.', 'Leve ao fogo médio, mexendo sempre, até engrossar (cerca de 5 minutos).', 'Desligue o fogo e espere amornar por 1 minuto.', 'Adicione o whey protein e misture vigorosamente para não empelotar.', 'Transfira para uma tigela e decore com as frutas vermelhas.']
                },
                { 
                    t: 'Tostada de Abacate', 
                    cal: 290, 
                    tags: ['Vegano'], 
                    ing: ['1 fatia de pão integral ou de fermentação natural', '1/2 abacate maduro', 'Suco de limão', 'Pimenta calabresa (flocos)', 'Sal a gosto', 'Sementes de girassol (opcional)'], 
                    inst: ['Torre a fatia de pão na torradeira ou frigideira até ficar crocante.', 'Em um prato, amasse o abacate grosseiramente com um garfo.', 'Tempere o abacate com sal e algumas gotas de limão.', 'Espalhe a pasta de abacate sobre o pão torrado.', 'Finalize polvilhando a pimenta calabresa e as sementes de girassol.']
                },
                { 
                    t: 'Omelete de Espinafre', 
                    cal: 200, 
                    tags: ['Low Carb', 'Sem Glúten'], 
                    ing: ['2 ovos', '1 xícara de folhas de espinafre lavadas', '5 tomates cereja cortados ao meio', '1 colher (café) de orégano', 'Sal a gosto'], 
                    inst: ['Pique grosseiramente as folhas de espinafre.', 'Bata os ovos com o sal e o orégano.', 'Misture o espinafre e os tomates aos ovos.', 'Unte uma frigideira com um fio de azeite e aqueça.', 'Despeje a mistura e cozinhe em fogo baixo com a frigideira tampada.', 'Quando firmar, vire com cuidado para dourar o outro lado.']
                },
                { 
                    t: 'Iogurte com Chia e Frutas', 
                    cal: 180, 
                    tags: ['Vegetariano', 'Sem Glúten'], 
                    ing: ['1 pote de iogurte natural desnatado', '1 colher (sopa) de sementes de chia', '5 morangos picados', '1 colher (chá) de mel (opcional)'], 
                    inst: ['Em uma tigela, misture o iogurte com as sementes de chia.', 'Deixe descansar por 10 minutos para a chia hidratar (ela vai formar um gel).', 'Pique os morangos em cubos pequenos.', 'Coloque as frutas por cima do iogurte.', 'Adicione o fio de mel se desejar adoçar.']
                },
                { 
                    t: 'Crepioca de Frango', 
                    cal: 310, 
                    tags: ['Sem Glúten'], 
                    ing: ['1 ovo', '2 colheres (sopa) de goma de tapioca', '3 colheres (sopa) de frango cozido desfiado', '1 colher (sopa) de queijo cottage ou ricota', 'Sal a gosto'], 
                    inst: ['Em um recipiente, bata o ovo com a goma de tapioca e uma pitada de sal até ficar homogêneo.', 'Aqueça uma frigideira antiaderente levemente untada.', 'Despeje a massa e deixe firmar como uma panqueca.', 'Vire a massa.', 'No centro, coloque o frango misturado com o queijo.', 'Dobre a crepioca ao meio e deixe o queijo derreter levemente.']
                },
                { 
                    t: 'Pão de Queijo de Frigideira', 
                    cal: 250, 
                    tags: ['Sem Glúten'], 
                    ing: ['1 ovo', '2 colheres (sopa) de goma de tapioca', '1 colher (sopa) de queijo parmesão ralado', '1 colher (sopa) de requeijão light', 'Sal a gosto'], 
                    inst: ['Misture todos os ingredientes em uma tigela pequena até obter uma massa lisa.', 'Se preferir, adicione sementes de chia na massa.', 'Aqueça uma frigideira pequena antiaderente.', 'Despeje a massa e cozinhe em fogo baixo.', 'Quando soltar do fundo, vire para dourar o outro lado. Sirva quente.']
                },
                { 
                    t: 'Salada de Frutas com Granola', 
                    cal: 200, 
                    tags: ['Vegano', 'Sem Lactose'], 
                    ing: ['1/2 fatia de mamão papaya', '1 fatia de melão', '1 banana pequena', '2 colheres (sopa) de granola sem açúcar', 'Suco de 1 laranja'], 
                    inst: ['Descasque e pique todas as frutas em cubos médios.', 'Misture as frutas em uma tigela.', 'Regue com o suco de laranja para não escurecer a banana.', 'Polvilhe a granola apenas na hora de servir para manter a crocância.']
                },
            ]
        },
        { 
            cat: 'Almoço', 
            baseImg: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
            templates: [
                { 
                    t: 'Salada Caesar com Frango', 
                    cal: 350, 
                    tags: ['Low Carb'], 
                    ing: ['1 filé de peito de frango grelhado em tiras', '1/2 maço de alface americana lavada', '1 colher (sopa) de queijo parmesão ralado', 'Para o molho: 2 colheres de iogurte natural, 1/2 limão, 1 colher de mostarda, sal e pimenta'], 
                    inst: ['Grelhe o frango temperado com sal e pimenta até dourar. Corte em tiras.', 'Rasgue as folhas de alface com as mãos e coloque em uma saladeira.', 'Misture os ingredientes do molho em um potinho até emulsionar.', 'Regue a salada com o molho e misture bem.', 'Finalize com o frango por cima e polvilhe o queijo parmesão.']
                },
                { 
                    t: 'Bowl de Quinoa e Legumes', 
                    cal: 320, 
                    tags: ['Vegano', 'Sem Glúten'], 
                    ing: ['1/2 xícara de quinoa cozida', '1/2 xícara de brócolis cozido no vapor', '1/2 cenoura ralada crua', '1/2 xícara de grão de bico cozido', 'Azeite e limão para temperar'], 
                    inst: ['Cozinhe a quinoa em água fervente com sal por 12 minutos. Escorra.', 'Em um bowl fundo, monte os ingredientes lado a lado: quinoa, brócolis, cenoura e grão de bico.', 'Tempere generosamente com azeite extra virgem, limão e sal.', 'Misture na hora de comer.']
                },
                { 
                    t: 'Filé de Tilápia com Purê', 
                    cal: 300, 
                    tags: ['Sem Glúten'], 
                    ing: ['1 filé de tilápia fresco', '1 dente de alho amassado', 'Suco de limão', '2 fatias de abóbora cabotiá cozida', 'Sal e pimenta a gosto'], 
                    inst: ['Tempere a tilápia com alho, limão, sal e pimenta. Deixe marinar por 10 minutos.', 'Grelhe o peixe em frigideira antiaderente por 3-4 minutos de cada lado.', 'Para o purê: amasse a abóbora cozida com um garfo, adicione um fio de azeite e acerte o sal.', 'Sirva o peixe acompanhado do purê rústico.']
                },
                { 
                    t: 'Escondidinho de Batata Doce', 
                    cal: 380, 
                    tags: ['Sem Glúten'], 
                    ing: ['1 batata doce média cozida', '150g de patinho moído', '1/2 cebola picada', '1 dente de alho', 'Cheiro verde a gosto', '1 colher (chá) de azeite'], 
                    inst: ['Refogue a carne moída com azeite, cebola e alho até ficar bem sequinha. Finalize com cheiro verde.', 'Amasse a batata doce cozida até virar um purê.', 'Em um refratário individual, faça uma camada com a carne moída.', 'Cubra com o purê de batata doce.', 'Leve ao forno ou airfryer por 10 minutos apenas para aquecer e dourar levemente.']
                },
                { 
                    t: 'Macarrão de Abobrinha', 
                    cal: 220, 
                    tags: ['Low Carb', 'Vegano'], 
                    ing: ['1 abobrinha italiana média', '1/2 xícara de molho de tomate caseiro', 'Manjericão fresco', '1 dente de alho laminado', 'Azeite'], 
                    inst: ['Fatie a abobrinha em tiras finas (tipo espaguete) usando um descascador ou mandolim.', 'Refogue o alho no azeite rapidamente.', 'Adicione a abobrinha e refogue por 1-2 minutos apenas para aquecer (não deixe amolecer demais).', 'Acrescente o molho de tomate quente.', 'Sirva imediatamente com folhas de manjericão fresco.']
                },
                { 
                    t: 'Strogonoff de Grão de Bico', 
                    cal: 310, 
                    tags: ['Vegano', 'Sem Lactose'], 
                    ing: ['1 xícara de grão de bico cozido', '100ml de leite de coco', '1/2 xícara de molho de tomate', '1/2 xícara de cogumelos fatiados', 'Mostarda a gosto'], 
                    inst: ['Em uma panela, refogue os cogumelos até dourarem.', 'Adicione o grão de bico e o molho de tomate.', 'Deixe ferver um pouco para apurar o sabor.', 'Abaixe o fogo e acrescente o leite de coco e a mostarda.', 'Misture bem e aqueça sem deixar ferver excessivamente. Sirva com arroz integral.']
                },
                { 
                    t: 'Frango com Quiabo', 
                    cal: 340, 
                    tags: ['Low Carb'], 
                    ing: ['2 sobrecoxas de frango sem pele', '200g de quiabo cortado em rodelas', '1/2 cebola', 'Alho e açafrão a gosto', 'Suco de 1/2 limão'], 
                    inst: ['Tempere o frango com alho, sal e limão.', 'Em uma panela, doure bem o frango no azeite.', 'Retire o frango e, na mesma panela, refogue a cebola e o quiabo (mexa pouco para não dar baba).', 'Volte o frango para a panela, adicione o açafrão e um pouco de água.', 'Tampe e cozinhe até o frango estar macio e o quiabo cozido.']
                },
                { 
                    t: 'Salada de Atum e Feijão Branco', 
                    cal: 290, 
                    tags: ['Sem Glúten'], 
                    ing: ['1 lata de atum em água escorrido', '1/2 xícara de feijão branco cozido (sem caldo)', '1/4 de cebola roxa picada em cubinhos', 'Salsinha picada', 'Azeite e vinagre de maçã'], 
                    inst: ['Em uma tigela, misture delicadamente o feijão branco e o atum.', 'Adicione a cebola roxa picada para dar crocância.', 'Tempere com bastante azeite, vinagre, sal e pimenta.', 'Finalize com a salsinha fresca.', 'Pode ser servido frio ou em temperatura ambiente.']
                },
                { 
                    t: 'Risoto de Couve-Flor', 
                    cal: 200, 
                    tags: ['Low Carb'], 
                    ing: ['2 xícaras de couve-flor crua triturada (textura de arroz)', '100g de peito de frango em cubos', '1 colher (sopa) de requeijão', '1 colher (sopa) de queijo parmesão', 'Caldo de legumes caseiro'], 
                    inst: ['Refogue o frango em cubos até dourar.', 'Adicione a couve-flor triturada e refogue por 2 minutos.', 'Vá adicionando o caldo de legumes aos poucos, mexendo sempre, até a couve-flor ficar macia.', 'Desligue o fogo.', 'Misture o requeijão e o parmesão para dar a cremosidade de risoto.', 'Sirva imediatamente.']
                },
                { 
                    t: 'Wrap de Alface com Carne', 
                    cal: 250, 
                    tags: ['Low Carb', 'Sem Lactose'], 
                    ing: ['4 folhas grandes de alface americana ou acelga', '200g de carne moída refogada bem temperada', '1 cenoura ralada fina', 'Tomate picadinho'], 
                    inst: ['Lave e seque bem as folhas de alface (elas serão as "tortilhas").', 'No centro de cada folha, coloque uma porção da carne moída quente.', 'Adicione a cenoura e o tomate por cima.', 'Enrole a folha de alface como se fosse um charuto ou taco.', 'Coma com as mãos.']
                },
            ]
        },
        { 
            cat: 'Jantar', 
            baseImg: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
            templates: [
                { 
                    t: 'Sopa Creme de Abóbora', 
                    cal: 180, 
                    tags: ['Vegano', 'Low Carb'], 
                    ing: ['300g de abóbora cabotiá descascada', '1 rodela de gengibre', '1/2 cebola', '500ml de água ou caldo de legumes', 'Sementes de abóbora para decorar'], 
                    inst: ['Cozinhe a abóbora e a cebola no caldo até ficarem bem macias.', 'Bata tudo no liquidificador com o gengibre até obter um creme liso.', 'Volte para a panela, acerte o sal e aqueça.', 'Sirva polvilhada com as sementes de abóbora torradas.']
                },
                { 
                    t: 'Omelete de Forno com Legumes', 
                    cal: 220, 
                    tags: ['Vegetariano', 'Low Carb'], 
                    ing: ['3 ovos', '1/2 abobrinha ralada', '1/2 cenoura ralada', '2 colheres de milho (opcional)', '1 colher de fermento em pó'], 
                    inst: ['Bata os ovos com um garfo.', 'Misture os legumes ralados e o fermento.', 'Tempere com sal e pimenta.', 'Despeje em forminhas de silicone (tipo muffin) ou em um refratário pequeno untado.', 'Leve ao forno pré-aquecido a 180°C por cerca de 20 minutos ou até dourar.']
                },
                { 
                    t: 'Salmão Grelhado com Aspargos', 
                    cal: 350, 
                    tags: ['Low Carb', 'Sem Glúten'], 
                    ing: ['1 posta de salmão (150g)', '6 aspargos frescos', 'Raspas de limão siciliano', 'Ervas finas', 'Azeite'], 
                    inst: ['Tempere o salmão com sal, pimenta e as raspas de limão.', 'Em uma frigideira quente com azeite, grelhe o salmão começando pela pele (3-4 min cada lado).', 'Na mesma frigideira, salteie os aspargos por 5 minutos até ficarem "al dente".', 'Sirva o peixe sobre os aspargos.']
                },
                { 
                    t: 'Salada Caprese', 
                    cal: 250, 
                    tags: ['Vegetariano'], 
                    ing: ['2 tomates caqui maduros', '4 fatias de muçarela de búfala', 'Folhas de manjericão fresco', 'Azeite extra virgem', 'Redução de balsâmico (opcional)'], 
                    inst: ['Corte os tomates e a muçarela em rodelas de espessura média.', 'Em um prato, intercale: uma fatia de tomate, uma de queijo, uma folha de manjericão.', 'Tempere com sal e pimenta moída na hora.', 'Regue com bastante azeite e um fio de balsâmico antes de servir.']
                },
                { 
                    t: 'Canja de Galinha Low Carb', 
                    cal: 200, 
                    tags: ['Low Carb'], 
                    ing: ['200g de peito de frango cozido e desfiado', '2 xícaras de couve-flor picadinha (substituindo o arroz)', '1 cenoura em cubinhos', '1 talo de salsão picado', 'Caldo de frango natural'], 
                    inst: ['Em uma panela, refogue a cenoura e o salsão.', 'Adicione o caldo de frango e cozinhe até a cenoura amaciar.', 'Acrescente o frango desfiado e a couve-flor picada.', 'Cozinhe por mais 5 minutos (a couve-flor cozinha rápido).', 'Finalize com salsinha picada.']
                },
                { 
                    t: 'Berinjela Recheada', 
                    cal: 280, 
                    tags: ['Low Carb'], 
                    ing: ['1 berinjela média', '150g de carne moída refogada', '2 colheres de molho de tomate', '1 colher de queijo ralado'], 
                    inst: ['Corte a berinjela ao meio no sentido do comprimento e faça cortes na polpa.', 'Leve ao microondas por 4-5 min para pré-cozinhar.', 'Retire um pouco da polpa com uma colher e misture à carne moída.', 'Recheie as cavidades da berinjela com a carne.', 'Cubra com molho e queijo.', 'Leve ao forno/airfryer para gratinar por 10 min.']
                },
                { 
                    t: 'Tofu Grelhado com Legumes', 
                    cal: 210, 
                    tags: ['Vegano'], 
                    ing: ['2 fatias grossas de tofu firme', '1 colher de shoyu light ou coco aminos', '1/2 pimentão vermelho em tiras', '1 xícara de broto de feijão (moyashi)', 'Gergelim'], 
                    inst: ['Pressione o tofu com papel toalha para tirar o excesso de água.', 'Grelhe o tofu em frigideira untada até dourar os dois lados. Reserve.', 'Na mesma frigideira, salteie o pimentão e o broto de feijão rapidamente (2 min).', 'Adicione o shoyu e misture.', 'Sirva os legumes sobre o tofu e polvilhe gergelim.']
                },
                { 
                    t: 'Ceviche de Tilápia', 
                    cal: 190, 
                    tags: ['Low Carb', 'Sem Lactose'], 
                    ing: ['2 filés de tilápia frescos e limpos', 'Suco de 2 limões taiti', '1/2 cebola roxa em fatias finíssimas', 'Coentro picado', 'Pimenta dedo de moça (opcional)'], 
                    inst: ['Corte o peixe em cubos pequenos e uniformes.', 'Coloque em uma tigela (de vidro ou cerâmica) e cubra com o suco de limão e sal.', 'Leve à geladeira por 15-20 minutos para "cozinhar" no limão.', 'Antes de servir, misture a cebola, o coentro e a pimenta.', 'Sirva bem gelado.']
                },
                { 
                    t: 'Wrap Integral de Hummus', 
                    cal: 300, 
                    tags: ['Vegano'], 
                    ing: ['1 pão folha (rap10) integral', '2 colheres de hummus (pasta de grão de bico)', 'Folhas de rúcula', 'Rodelas de pepino japonês', 'Tomate seco (opcional)'], 
                    inst: ['Aqueça o pão na frigideira rapidamente.', 'Espalhe o hummus por toda a superfície.', 'Disponha a rúcula e o pepino no centro.', 'Enrole bem apertado.', 'Corte ao meio na diagonal para servir.']
                },
                { 
                    t: 'Sopa Verde Detox', 
                    cal: 150, 
                    tags: ['Vegano', 'Low Carb'], 
                    ing: ['1 maço de espinafre', '1 abobrinha', '1 chuchu', '1 dente de alho', 'Hortelã fresca'], 
                    inst: ['Cozinhe a abobrinha e o chuchu em pouca água até amaciarem.', 'Nos últimos minutos, adicione o espinafre (cozinha rápido).', 'Bata tudo no liquidificador com o alho e a hortelã.', 'Não precisa coar. Aqueça novamente se necessário.', 'Tempere com sal e um fio de azeite no prato.']
                },
            ]
        },
        { 
            cat: 'Lanche', 
            baseImg: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?q=80&w=800',
            templates: [
                { 
                    t: 'Mix de Castanhas', 
                    cal: 180, 
                    tags: ['Vegano', 'Low Carb'], 
                    ing: ['2 castanhas do Pará', '4 nozes', '10 amêndoas cruas ou torradas', 'Opcional: pitada de sal ou alecrim'], 
                    inst: ['Esta é uma opção prática "grab & go".', 'Misture as castanhas em um potinho pequeno.', 'Se preferir, toste-as levemente na frigideira seca por 2 minutos para realçar o sabor e a crocância.', 'Consuma com moderação, pois são calóricas.']
                },
                { 
                    t: 'Chips de Coco', 
                    cal: 150, 
                    tags: ['Vegano', 'Low Carb'], 
                    ing: ['50g de coco seco em lâminas (fitas)', 'Canela em pó a gosto'], 
                    inst: ['Compre o coco já laminado ou use um descascador de legumes no coco fresco.', 'Espalhe as fitas em uma assadeira.', 'Leve ao forno baixo (160°C) por cerca de 10-15 minutos, mexendo na metade do tempo.', 'Fique de olho para não queimar. Devem ficar dourados e crocantes.', 'Polvilhe canela assim que tirar do forno.']
                },
                { 
                    t: 'Ovo de Codorna Temperado', 
                    cal: 140, 
                    tags: ['Low Carb'], 
                    ing: ['10 ovos de codorna cozidos', '1 fio de azeite', 'Orégano', 'Pimenta do reino'], 
                    inst: ['Cozinhe os ovos, descasque e lave.', 'Em um potinho, tempere com azeite, sal, orégano e pimenta.', 'Ótima opção de proteína rápida para levar na bolsa.']
                },
                { 
                    t: 'Palitos de Cenoura com Hummus', 
                    cal: 160, 
                    tags: ['Vegano', 'Sem Glúten'], 
                    ing: ['1 cenoura média', '2 colheres (sopa) de hummus (pasta de grão de bico)', 'Páprica doce para decorar'], 
                    inst: ['Descasque a cenoura e corte em bastonetes (palitos) de aprox. 8cm.', 'Coloque o hummus em um pote pequeno.', 'Polvilhe páprica sobre a pasta.', 'Use os palitos de cenoura para "pescar" o hummus.']
                },
                { 
                    t: 'Muffin de Banana (Sem farinha)', 
                    cal: 190, 
                    tags: ['Sem Glúten'], 
                    ing: ['1 banana bem madura', '1 ovo', '1 colher (sopa) de cacau em pó 100%', '1 colher (café) de fermento químico'], 
                    inst: ['Amasse bem a banana.', 'Misture com o ovo e o cacau até ficar homogêneo.', 'Por último, adicione o fermento delicadamente.', 'Coloque em 2 forminhas de silicone.', 'Asse na airfryer a 160°C por 10-12 minutos ou no forno a 180°C por 15 minutos.']
                },
                { 
                    t: 'Biscoito de Arroz com Pasta de Amendoim', 
                    cal: 200, 
                    tags: ['Vegano'], 
                    ing: ['2 biscoitos de arroz integral (redondos)', '1 colher (sopa) de pasta de amendoim integral', 'Canela a gosto'], 
                    inst: ['Espalhe a pasta de amendoim sobre os biscoitos de arroz.', 'Se quiser, adicione rodelas de banana (opcional, aumenta as calorias) ou apenas polvilhe canela.', 'Consuma imediatamente para o biscoito não murchar.']
                },
                { 
                    t: 'Queijo Coalho Assado', 
                    cal: 220, 
                    tags: ['Vegetariano'], 
                    ing: ['1 espeto de queijo coalho light', 'Orégano seco'], 
                    inst: ['Aqueça uma frigideira antiaderente (não precisa de óleo).', 'Coloque o queijo e deixe dourar bem de todos os lados.', 'Polvilhe orégano enquanto doura.', 'O objetivo é criar uma casquinha crocante por fora e ficar macio por dentro.']
                },
                { 
                    t: 'Chips de Batata Doce (Airfryer)', 
                    cal: 170, 
                    tags: ['Vegano'], 
                    ing: ['1 batata doce pequena', '1 colher (chá) de azeite', 'Sal e alecrim'], 
                    inst: ['Lave bem a batata e corte em rodelas muito finas (com casca mesmo).', 'Coloque em uma tigela e misture com o azeite e temperos para envolver todas as fatias.', 'Disponha na cesta da airfryer sem sobrepor muito.', 'Asse a 180°C por 10-15 min, agitando a cesta a cada 5 min até ficarem crocantes.']
                },
                { 
                    t: 'Iogurte Grego com Mel', 
                    cal: 180, 
                    tags: ['Vegetariano'], 
                    ing: ['1 pote de iogurte grego natural (preferência zero gordura)', '1 colher (chá) de mel', '3 nozes picadas'], 
                    inst: ['Simples e eficaz: coloque o iogurte no bowl.', 'Regue com o mel.', 'Quebre as nozes com as mãos e jogue por cima para dar textura.']
                },
                { 
                    t: 'Barra de Proteína Caseira', 
                    cal: 250, 
                    tags: ['Sem Glúten'], 
                    ing: ['1/2 xícara de aveia', '2 colheres de pasta de amendoim', '1 scoop de whey protein', 'Um pouco de água ou leite para dar liga'], 
                    inst: ['Misture todos os ingredientes em uma tigela até formar uma massa modelável.', 'Se ficar muito seco, adicione água aos poucos.', 'Molde no formato de barrinhas.', 'Leve à geladeira por 30 minutos para firmar.', 'Pode ser embalada em papel filme e levada na bolsa.']
                },
            ]
        },
        { 
            cat: 'Bebidas', 
            baseImg: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=800',
            templates: [
                { 
                    t: 'Suco Verde Clássico', 
                    cal: 80, 
                    tags: ['Vegano', 'Detox'], 
                    ing: ['1 folha de couve', 'Suco de 1 limão', '1 maçã com casca', '1 rodela de gengibre', '200ml de água gelada'], 
                    inst: ['Lave bem os ingredientes.', 'Bata tudo no liquidificador até desmanchar bem a couve.', 'Não coe, para aproveitar as fibras que ajudam na saciedade.', 'Beba em seguida.']
                },
                { 
                    t: 'Chá de Hibisco com Canela', 
                    cal: 5, 
                    tags: ['Vegano', 'Zero Cal'], 
                    ing: ['1 colher (sopa) de flor de hibisco desidratada', '1 pau de canela', '500ml de água'], 
                    inst: ['Ferva a água com a canela.', 'Assim que ferver, desligue o fogo e adicione o hibisco.', 'Tampe e deixe em infusão por 5-8 minutos.', 'Coe e beba quente ou gelado ao longo do dia.']
                },
                { 
                    t: 'Suchá de Abacaxi', 
                    cal: 90, 
                    tags: ['Vegano'], 
                    ing: ['200ml de chá verde pronto e gelado', '1 fatia grossa de abacaxi', 'Folhas de hortelã'], 
                    inst: ['Prepare o chá verde antecipadamente e deixe gelar.', 'Bata no liquidificador o chá com o abacaxi e a hortelã.', 'Fica super refrescante e diurético.']
                },
                { 
                    t: 'Golden Milk (Leite Dourado)', 
                    cal: 120, 
                    tags: ['Vegano', 'Anti-inflamatório'], 
                    ing: ['200ml de leite de amêndoas ou coco', '1 colher (café) de cúrcuma em pó (açafrão)', '1 pitada de pimenta preta (ativa a cúrcuma)', 'Canela em pó', 'Adoçante a gosto'], 
                    inst: ['Aqueça o leite vegetal.', 'Adicione a cúrcuma, a pimenta e a canela.', 'Misture bem (use um mixer de mão se tiver para fazer espuma).', 'Beba morno antes de dormir para relaxar.']
                },
                { 
                    t: 'Água Aromatizada Cítrica', 
                    cal: 0, 
                    tags: ['Vegano', 'Hidratação'], 
                    ing: ['1 litro de água gelada (ou com gás)', 'Rodelas de 1 limão siciliano', 'Rodelas de 1 laranja', 'Ramos de alecrim'], 
                    inst: ['Em uma jarra, coloque as frutas e o alecrim.', 'Adicione a água e muito gelo.', 'Deixe curtir por 15 minutos antes de servir.', 'Vá repondo a água conforme for bebendo.']
                },
                { 
                    t: 'Shake de Cacau e Banana', 
                    cal: 250, 
                    tags: ['Vegetariano', 'Proteico'], 
                    ing: ['1 banana congelada em rodelas', '200ml de leite desnatado ou vegetal', '1 colher (sopa) de cacau em pó 100%', '1 scoop de whey (opcional)'], 
                    inst: ['O segredo é a banana congelada, que dá textura de sorvete.', 'Bata tudo no liquidificador até ficar cremoso.', 'Ótimo para pré ou pós-treino.']
                },
                { 
                    t: 'Suco de Melancia com Gengibre', 
                    cal: 100, 
                    tags: ['Vegano'], 
                    ing: ['2 fatias de melancia', '1 colher (café) de gengibre ralado', 'Gelo'], 
                    inst: ['Bata a melancia (sem sementes se possível) com o gengibre.', 'Não precisa adicionar água, a melancia já tem bastante.', 'Beba gelado. O gengibre acelera o metabolismo.']
                },
                { 
                    t: 'Chá de Camomila e Maracujá', 
                    cal: 10, 
                    tags: ['Vegano', 'Relaxante'], 
                    ing: ['1 sachê de camomila', 'Polpa de 1/2 maracujá', '200ml de água quente'], 
                    inst: ['Faça o chá de camomila na água quente.', 'Adicione a polpa de maracujá e misture.', 'Deixe descansar por 3 minutos.', 'Coe as sementes se preferir, ou coma-as (são ricas em fibra).']
                },
                { 
                    t: 'Limonada Suíça Fit', 
                    cal: 40, 
                    tags: ['Vegano'], 
                    ing: ['1 limão taiti com casca (bem lavado)', '500ml de água gelada', 'Adoçante a gosto', 'Gelo'], 
                    inst: ['Corte o limão em 4 partes e retire a parte branca do meio (para não amargar).', 'Bata no liquidificador com a água por apenas 10 segundos (se bater muito amarga).', 'Coe imediatamente e adoce a gosto.', 'Sirva com muito gelo.']
                },
                { 
                    t: 'Café Bulletproof', 
                    cal: 180, 
                    tags: ['Low Carb', 'Energia'], 
                    ing: ['1 xícara de café preto quente forte', '1 colher (chá) de óleo de coco', '1 colher (chá) de manteiga ghee'], 
                    inst: ['Não basta misturar com a colher.', 'Coloque tudo no liquidificador ou use um mixer.', 'Bata por 20 segundos até o café ficar mais claro e espumoso.', 'Beba quente para energia instantânea.']
                },
            ]
        }
    ];

    const allRecipes: Recipe[] = [];
    let idCounter = 1;

    // Generate ~30 recipes per category by duplicating templates with variations
    categories.forEach(cat => {
        // Pass 1: Original
        cat.templates.forEach(t => {
            allRecipes.push({
                id: `rec-${idCounter++}`,
                title: t.t,
                calories: t.cal,
                time_minutes: Math.floor(Math.random() * 20) + 5,
                category: cat.cat,
                image_url: cat.baseImg,
                ingredients: t.ing,
                instructions: t.inst,
                tags: t.tags
            });
        });
        // Pass 2: Variation A (Especial)
        cat.templates.forEach(t => {
            allRecipes.push({
                id: `rec-${idCounter++}`,
                title: `${t.t} Especial`,
                calories: t.cal + 50,
                time_minutes: Math.floor(Math.random() * 20) + 10,
                category: cat.cat,
                image_url: cat.baseImg,
                ingredients: [...t.ing, 'Ingrediente extra especial a gosto'],
                instructions: [...t.inst, 'Dica Especial: Adicione o ingrediente extra no final para dar um toque gourmet e sabor diferenciado.'],
                tags: t.tags
            });
        });
        // Pass 3: Variation B (Rápido)
        cat.templates.forEach(t => {
            allRecipes.push({
                id: `rec-${idCounter++}`,
                title: `${t.t} Express`,
                calories: t.cal,
                time_minutes: 10,
                category: cat.cat,
                image_url: cat.baseImg,
                ingredients: t.ing,
                instructions: t.inst, // Same instructions, just labeled differently for variety
                tags: t.tags
            });
        });
    });

    return allRecipes;
}

const MOCK_RECIPES = generateRecipes();

// --- WORKOUTS (28 DAYS GENERATOR) ---
const generateMockWorkouts = (): Workout[] => {
    return Array.from({ length: 28 }, (_, i) => {
        const day = i + 1;
        // Logic to vary content slightly
        const isRest = day % 7 === 0; // Every 7th day could be different
        const difficulty = day <= 7 ? 'Iniciante' : day <= 21 ? 'Intermediário' : 'Avançado';
        
        return {
            id: `workout-${day}`,
            day_number: day,
            title: `Treino Dia ${day}`,
            description: 'Foco em força e estabilidade.',
            duration_minutes: 20 + (i % 10), // varies between 20-30 mins
            difficulty: difficulty,
            video_url: '',
            thumbnail_url: `https://picsum.photos/seed/${100 + day}/800/600`,
            is_locked: day > 3, // Unlock first 3 days
            completed: false
        };
    });
};

const MOCK_WORKOUTS: Workout[] = generateMockWorkouts();

interface AppState {
  currentScreen: AppScreen;
  user: UserProfile | null;
  workouts: Workout[];
  recipes: Recipe[];
  badges: Badge[];
  dailyTip: DailyTip;
  mindsetItems: MindsetItem[];
  journal: JournalEntry[];
  selectedWorkoutId: string | null;
  theme: 'dark' | 'light';
  waterIntakeL: number;
  newBadgeUnlocked: Badge | null;
  
  // Actions
  setScreen: (screen: AppScreen) => void;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string, phone: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  selectWorkout: (id: string) => void;
  toggleCompleteWorkout: (id: string) => void;
  toggleCompleteMindset: (id: string) => void;
  toggleTheme: () => void;
  
  // Data Logging
  logWeight: (weight: number) => Promise<void>;
  logWater: (amountL: number) => Promise<void>;
  logJournal: (text: string) => Promise<void>;
  updateProfileStats: (height: number, targetWeight: number, currentWeight: number) => Promise<void>;
  updateAvatar: (url: string) => Promise<void>;
  updateProgressPhoto: (type: 'start' | 'current', url: string) => Promise<void>;
  addGalleryPhoto: (url: string) => Promise<void>; // New Action
  clearNewBadge: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: AppScreen.AUTH,
  user: null,
  workouts: MOCK_WORKOUTS,
  recipes: MOCK_RECIPES,
  badges: BADGES,
  dailyTip: DAILY_TIPS[0],
  mindsetItems: MOCK_MINDSET,
  journal: [],
  selectedWorkoutId: null,
  theme: 'dark',
  waterIntakeL: 0,
  newBadgeUnlocked: null,

  setScreen: (screen) => set({ currentScreen: screen }),

  initialize: async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
            await get().fetchUserData(session.user.id);
            set({ currentScreen: AppScreen.DASHBOARD });
        }
    } catch (e) {
        console.log("Inicialização: Sem sessão ativa ou offline.");
    }
  },

  fetchUserData: async (userId: string) => {
      try {
          // 1. Fetch Profile
          let { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (error || !profile) {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                   const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({
                        id: userId,
                        email: user.email,
                        full_name: user.user_metadata?.full_name || 'Usuário',
                        current_weight_kg: 60,
                        target_weight_kg: 55,
                        height_cm: 160
                   }).select().single();
                   
                   if (!insertError && newProfile) {
                       profile = newProfile;
                   } else {
                       return;
                   }
              } else {
                  return;
              }
          }

          // 2. Fetch Weight History
          const { data: weightLogs } = await supabase
            .from('weight_logs')
            .select('created_at, weight_kg, photo_url')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

          const weightHistory = weightLogs?.map(log => ({
              date: new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
              weight: log.weight_kg
          })) || [];

          // Simulate progress photos from weight logs if they exist, or empty array
          // In a real app, this might be a separate table or filtered from weight_logs
          const progressPhotos = weightLogs
            ?.filter(log => log.photo_url)
            .map(log => ({
                id: Math.random().toString(), // Mock ID
                date: new Date(log.created_at).toLocaleDateString('pt-BR'),
                url: log.photo_url,
                weight: log.weight_kg
            })) || [];

          // 3. Fetch Water Today
          const today = new Date().toISOString().split('T')[0];
          const { data: waterLogs } = await supabase
            .from('water_logs')
            .select('amount_ml')
            .eq('user_id', userId)
            .gte('created_at', `${today}T00:00:00`);
          
          const totalWaterL = (waterLogs?.reduce((acc, curr) => acc + curr.amount_ml, 0) || 0) / 1000;

          // 4. Fetch Journal
          const { data: journalEntries } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          const journal = journalEntries?.map(j => ({
              id: j.id,
              date: new Date(j.created_at).toLocaleDateString('pt-BR'),
              content: j.content
          })) || [];

          // 5. Fetch Completed Workouts
          const { data: progress } = await supabase.from('user_workout_progress').select('workout_id').eq('user_id', userId);
          const completedIds = progress?.map(p => p.workout_id) || [];
          
          // Update State
          set((state) => ({
              user: {
                  id: userId,
                  email: profile.email,
                  full_name: profile.full_name || 'Usuário',
                  phone: profile.phone,
                  current_weight_kg: profile.current_weight_kg || 60,
                  starting_weight_kg: weightHistory[0]?.weight || profile.current_weight_kg || 60,
                  target_weight_kg: profile.target_weight_kg || 55,
                  height_cm: profile.height_cm || 160,
                  streak_days: profile.streak_days || 0,
                  is_premium: profile.is_premium,
                  avatar_url: profile.avatar_url,
                  start_photo_url: profile.start_photo_url,
                  current_photo_url: profile.current_photo_url,
                  progress_photos: progressPhotos,
                  weight_history: weightHistory,
                  earned_badges: [] 
              },
              waterIntakeL: totalWaterL,
              journal: journal,
              workouts: state.workouts.map(w => ({
                  ...w,
                  completed: completedIds.includes(w.id) 
              }))
          }));
      } catch (e) {
          console.error("Erro crítico ao carregar dados:", e);
      }
  },

  login: async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
            await get().fetchUserData(data.user.id);
            set({ currentScreen: AppScreen.DASHBOARD });
            return true;
        }
    } catch (e: any) {
        console.error("Login Error:", e.message);
        throw e;
    }
    return false;
  },

  register: async (email, password, fullName, phone) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone
                }
            }
        });
        if (error) throw error;
        if (data.user) {
            if (data.session) {
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: email,
                    full_name: fullName,
                    current_weight_kg: 60,
                    target_weight_kg: 55,
                    height_cm: 160
                }).select();
                await get().fetchUserData(data.user.id);
                set({ currentScreen: AppScreen.DASHBOARD });
                return true;
            } else {
                return true; 
            }
        }
    } catch (e: any) {
         console.error("Register Error:", e.message);
         throw e;
    }
    return false;
  },

  resetPassword: async (email) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        return !error;
      } catch(e) { return false; }
  },
  
  logout: async () => {
      try { await supabase.auth.signOut(); } catch(e) {}
      set({ user: null, currentScreen: AppScreen.AUTH });
  },

  selectWorkout: (id) => set({ selectedWorkoutId: id, currentScreen: AppScreen.WORKOUT_DETAILS }),
  
  toggleCompleteWorkout: async (id) => {
    const { user, workouts } = get();
    if (!user) return;
    set({ workouts: workouts.map(w => w.id === id ? { ...w, completed: !w.completed } : w) });
    const workout = workouts.find(w => w.id === id);
    if (!workout) return;
    if (!workout.completed) {
        try {
            await supabase.from('user_workout_progress').insert({ user_id: user.id, workout_id: id });
            get().logJournal(`Concluí o treino: ${workout.title} 🔥`);
        } catch (e) {}
    }
  },

  toggleCompleteMindset: async (id) => {
      const { user, mindsetItems } = get();
      if (!user) return;
      set({ mindsetItems: mindsetItems.map(m => m.id === id ? { ...m, completed: !m.completed } : m) });
      const item = mindsetItems.find(i => i.id === id);
      if(!item) return;
      if (!item.completed) {
           try {
              await supabase.from('user_mindset_progress').insert({ user_id: user.id, item_id: id });
           } catch(e) {}
      }
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  
  logWeight: async (newWeight) => {
      const { user } = get();
      if (!user) return;
      const today = new Date();
      const dateLabel = today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      set((state) => ({
          user: state.user ? {
              ...state.user,
              current_weight_kg: newWeight,
              weight_history: [...state.user.weight_history, { date: dateLabel, weight: newWeight }]
          } : null
      }));
      try {
        await supabase.from('weight_logs').insert({ user_id: user.id, weight_kg: newWeight });
        await supabase.from('profiles').update({ current_weight_kg: newWeight }).eq('id', user.id);
      } catch(e) {}
  },

  logWater: async (amountL) => {
      const { user, waterIntakeL } = get();
      if (!user) return;
      set({ waterIntakeL: Number((waterIntakeL + amountL).toFixed(1)) });
      try { await supabase.from('water_logs').insert({ user_id: user.id, amount_ml: amountL * 1000 }); } catch(e) {}
  },

  logJournal: async (text) => {
      const { user, journal } = get();
      if (!user) return;
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR'),
        content: text
      };
      set({ journal: [newEntry, ...journal] });
      try { await supabase.from('journal_entries').insert({ user_id: user.id, content: text }); } catch(e) {}
  },

  updateProfileStats: async (height, targetWeight, currentWeight) => {
      const { user } = get();
      if (!user) return;
      set((state) => ({
          user: state.user ? { ...state.user, height_cm: height, target_weight_kg: targetWeight, current_weight_kg: currentWeight } : null
      }));
      try {
          await supabase.from('profiles').update({ height_cm: height, target_weight_kg: targetWeight, current_weight_kg: currentWeight }).eq('id', user.id);
      } catch(e) {}
  },

  updateAvatar: async (url: string) => {
      const { user } = get();
      if (!user) return;
      set((state) => ({ user: state.user ? { ...state.user, avatar_url: url } : null }));
      try { await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id); } catch(e) {}
  },

  updateProgressPhoto: async (type: 'start' | 'current', url: string) => {
      const { user } = get();
      if (!user) return;
      
      set((state) => ({
          user: state.user ? {
              ...state.user,
              start_photo_url: type === 'start' ? url : state.user.start_photo_url,
              current_photo_url: type === 'current' ? url : state.user.current_photo_url
          } : null
      }));

      try {
          const field = type === 'start' ? 'start_photo_url' : 'current_photo_url';
          await supabase.from('profiles').update({ [field]: url }).eq('id', user.id);
      } catch(e) {}
  },

  addGalleryPhoto: async (url: string) => {
      const { user } = get();
      if (!user) return;

      const newPhoto = {
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('pt-BR'),
          url: url,
          weight: user.current_weight_kg
      };

      set((state) => ({
          user: state.user ? {
              ...state.user,
              progress_photos: [newPhoto, ...state.user.progress_photos]
          } : null
      }));
      
      // In a real implementation, we would insert this into a separate 'progress_photos' table or 'weight_logs'
      try {
          await supabase.from('weight_logs').insert({ 
              user_id: user.id, 
              weight_kg: user.current_weight_kg,
              photo_url: url,
              note: 'Foto de progresso da Galeria'
          });
      } catch(e) {}
  },

  clearNewBadge: () => set({ newBadgeUnlocked: null })
}));