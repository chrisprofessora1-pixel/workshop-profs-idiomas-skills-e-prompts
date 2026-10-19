import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Biblioteca OpenCode" },
      { name: "description", content: "Copie, cole, faça seu. Os prompts, skills e agentes do Workshop Material Autoral, por Chris Castelli." },
      { property: "og:title", content: "Biblioteca OpenCode" },
      { property: "og:description", content: "Copie, cole, faça seu. Os prompts, skills e agentes do Workshop Material Autoral, por Chris Castelli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpenCodeLibraryPage,
});

type Tab = "prompts" | "skills";

type PromptCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  body: string;
};

type SkillCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  tag: string;
  githubUrl: string;
};





const workshopPrompts: PromptCard[] = [
  {
    id: "w-atividade",
    category: "Workshop",
    title: "Atividade interativa",
    description: "Versão completa, use com o agente Visu: flashcards clicáveis do seu tema, prontos para projetar.",
    body: `Visu, crie flashcards interativos para minha turma (use o agente Visu para gerar o visual):

- Idioma: [INGLÊS]
- Nível: [A1]
- Tema: [comparatives, cheap/cheaper, tall/taller]
- Quantidade: [30] cards

Regras do material:
1. Cada card tem FRENTE (palavra base) e VERSO (resposta + tradução curta em pt-BR).
2. Clique vira o card (efeito flip). Inclua botão de embaralhar e filtros por grupo.
3. Visual simples para projetar: fundo claro, fonte grande, 1 instrução no topo.
4. No topo: título + nível + meu nome [[SEU NOME]].
5. No final: 1 dica de uso em aula em 2 linhas.
6. Salve como atividade-[tema].html e me diga como abrir e imprimir em PDF.`,
  },
  {
    id: "w-prova",
    category: "Workshop",
    title: "Prova com gabarito",
    description: "Versão completa: prova justa de 30 minutos + gabarito com critérios de correção.",
    body: `Crie uma prova + gabarito para minha turma:

- Idioma: [INGLÊS]
- Nível: [A1]
- Conteúdo: [verbo to be afirmativo, I am, you are, he/she/it is]
- Questões: [10] (complete, múltipla escolha e 2 de escrita curta)

Regras:
1. Prova em linguagem simples, 1 ponto por questão, com cabeçalho (nome, data, turma).
2. Inclua quadro-resumo do conteúdo no topo para o aluno consultar.
3. Gere DOIS arquivos: prova-[tema].md (sem respostas) e gabarito-[tema].md (com respostas + 1 linha explicando cada uma).
4. Erros clássicos de brasileiros precisam aparecer (ex: esquecer o pronome I/you/he).
5. No fim do gabarito: critérios de correção rápida.
6. Me diga como transformar em PDF.`,
  },
  {
    id: "w-lista",
    category: "Workshop",
    title: "Lista de vocabulário",
    description: "Versão completa no seu molde: ficha A1 em 5 blocos, pronta para A4 paisagem.",
    body: `Crie uma ficha de vocabulário no meu molde A1 (página única, estilo mapa mental):

- Idioma: [INGLÊS]
- Nível: [A1]
- Tema: [alfabeto]
- Itens: [26 letras] com pronúncia aportuguesada (ex: A = "ei", B = "bi")

Estrutura obrigatória (5 blocos):
1. Lista em ordem (grupos de 5)
2. Como pronunciar (pronúncia + confusões comuns: E/I, G/J)
3. Exemplos (5 palavras com emoji + tradução)
4. Regra rápida (1 frase)
5. Dica + mini-exercício de 5 linhas no rodapé

Formato: HTML único + CSS inline, pronto para A4 paisagem, com badge "Nível A1" e assinatura [SEU NOME]. Salve como ficha-[tema].html e me diga como gerar o PDF.`,
  },
  {
    id: "w-listening",
    category: "Workshop",
    title: "Listening completo",
    description: "Diálogo + legenda + quiz de compreensão, pronto para gerar o áudio.",
    body: `Monte um listening completo para minha turma:

- Idioma: [INGLÊS]
- Nível: [A1]
- Situação: [no aeroporto, check-in, gate, seat]
- Tamanho: diálogo de [16 linhas], frases curtas, vocabulário repetido

Entregue 3 coisas:
1. listening-[tema].txt: diálogo só no idioma-alvo, 1 fala por linha, sem tradução (para gerar o áudio).
2. listening-[tema].srt: mesma fala numerada com tempos estimados para legendar.
3. quiz-[tema].md: 5 perguntas de compreensão (3 múltipla escolha + 2 verdadeiro/falso) + gabarito no fim.

Regras:
- Frases que o aluno realmente vai usar (ex: "Where is the gate?", "seat 14A, window seat").
- Repita 5 palavras-chave pelo menos 2x no diálogo.
- Me diga o passo a passo para gerar o áudio e como usar em aula (ouvir 2x sem texto, 1x com legenda).`,
  },
];

const teacherPrompts: PromptCard[] = [
  {
    id: "t-worksheet",
    category: "Para professores",
    title: "Atividade para aula",
    description: "Versão rápida: worksheet pronta para sua turma, com espaço para responder.",
    body: `Monte uma atividade sobre [TEMA] para [IDADE OU NÍVEL]. Misture tipos de exercício: múltipla escolha, complete as lacunas, relacione as colunas e uma escrita curta. Deixe espaço para o aluno responder. Instruções simples, no nível da turma. Salve em arquivo pronto para imprimir, com o gabarito no fim, separado da cópia do aluno.`,
  },
  {
    id: "t-exam",
    category: "Para professores",
    title: "Prova pronta",
    description: "Versão rápida: prova no formato escolar, pronta para aplicar.",
    body: `Monte uma prova sobre [TEMA] para [NÍVEL]. Use questões de múltipla escolha, tarefas numeradas com o valor de cada uma e uma seção de leitura com texto curto + perguntas. Nota total no topo. Salve em arquivo pronto para imprimir, com o gabarito no fim, separado da cópia do aluno.`,
  },
  {
    id: "t-discussion",
    category: "Para professores",
    title: "Perguntas para debate",
    description: "Perguntas que fazem a próxima aula realmente conversar.",
    body: `Com base em [MATERIAL], me dê perguntas para debater na próxima aula. Abertas, sem resposta sim ou não: algumas de compreensão, algumas de opinião e uma ou duas ligando com a vida deles. Umas dez no total, agrupadas por tema, marcando as duas que vão render mais debate.`,
  },
  {
    id: "t-lesson",
    category: "Para professores",
    title: "Plano de aula",
    description: "Do tema à atividade e à avaliação, com tempo de cada parte.",
    body: `Transforme [TEMA] em um plano de aula para [IDADE OU NÍVEL]. Comece com 1 objetivo claro. Depois o plano em blocos de tempo: abertura curta, 2 ou 3 atividades principais e fechamento rápido, com minutos de cada parte e o que preparar. Termine com 1 avaliação de 1 linha para ver se a aula funcionou.`,
  },
  {
    id: "t-retrieval",
    category: "Para professores",
    title: "Quiz de abertura",
    description: "Quiz rápido para abrir a aula e ver o que ficou.",
    body: `Monte um quiz rápido de revisão sobre [TEMA] para abrir a aula. 5 perguntas, do fácil ao difícil, misturando completar, múltipla escolha e 1 de memória. Coisa de 5 minutos. Respostas no fim para corrigir rápido.`,
  },
  {
    id: "t-game",
    category: "Para professores",
    title: "Jogo para aula",
    description: "Um jogo simples em 1 arquivo, sem instalar nada.",
    body: `Monte um jogo para [PARA QUE: ex. revisar comparatives com A1] com [NÍVEL]. Simples e divertido, em 1 arquivo só que eu abra sem instalar nada. Me diga como abrir. Quando eu mandar ideias novas, some no mesmo jogo em vez de recomeçar, e teste a cada mudança para nada quebrar.`,
  },
];

const builderPrompts: PromptCard[] = [
  {
    id: "c-skill-nova",
    category: "Criar e modificar",
    title: "Criar skill nova",
    description: "Transforme sua rotina repetida em skill reutilizável, pronta para chamar em 1 frase.",
    body: `Crie uma skill nova para meu OpenCode:

- Nome da skill: [NOME CURTO, ex: quiz-rapido]
- Quando usar: [QUANDO CHAMAR, ex: quando eu disser "Quiz rapido sobre..."]
- O que ela faz: [DESCREVA EM 2 LINHAS, ex: gera 5 perguntas do facil ao dificil + gabarito no fim]
- Formato de saida: [ex: markdown pronto para imprimir, com gabarito separado]
- Exemplo real: [COLE 1 EXEMPLO BOM SEU, ou escreva "use meu padrao de prova"]

Regras:
1. Gere a pasta skills/[NOME]/ com SKILL.md completo: nome, descricao com gatilhos em PT, workflow em passos numerados.
2. Deixe os gatilhos em portugues do jeito que eu falo (ex: "faz quiz", "monta prova").
3. No fim, me diga como testar em 1 frase e como chamar a skill depois.
4. Nada de teoria. So entregue a skill pronta.`,
  },
  {
    id: "c-modificar-agente",
    category: "Criar e modificar",
    title: "Modificar agente",
    description: "Ajuste um agente pronto para falar do seu jeito e fazer do seu jeito.",
    body: `Modifique este agente do meu OpenCode para meu jeito de dar aula:

- Agente: [NOME, ex: Dicien / Visu / Homework / Corretor]
- O que manter: [ex: formato atual, tom direto]
- O que mudar: [ex: exemplos mais curtos, sempre com traducao, sempre com audio]
- Meu padrao: [COLE 1 EXEMPLO DO SEU GOSTO ou escreva "siga minha ultima ficha"]

Regras:
1. Abra o arquivo agents/[NOME].md ou skills/[NOME]/SKILL.md e mostre o que vai mudar antes de mudar.
2. Edite so o necessario. Nao reescreva tudo.
3. Mantenha os gatilhos antigos funcionando e adicione meus novos gatilhos em PT.
4. No fim, me diga como testar com 1 comando e o que mudou em 3 bullets.`,
  },
  {
    id: "c-criar-agente",
    category: "Criar e modificar",
    title: "Criar agente pessoal",
    description: "Crie seu assistente com nome, jeito e rotina, pronto para chamar pelo nome.",
    body: `Crie um agente novo para meu OpenCode:

- Nome do agente: [ex: Roteirista]
- Quando chamar: [ex: quando eu disser "Roteirista, ..."]
- Personalidade: [ex: direto, pratico, sem teoria]
- Rotina: [DESCREVA EM 3 PASSOS, ex: 1 entende tema e nivel, 2 gera roteiro com tempos, 3 entrega arquivo pronto]
- Exemplo de entrada e saida: [COLE 1 EXEMPLO CURTO]

Regras:
1. Gere agents/[NOME].md com descricao, gatilhos em PT e rotina em passos.
2. Deixe o agente pronto para chamar pelo nome em qualquer conversa.
3. No fim, me diga como testar com 1 frase e como modificar depois.`,
  },
];

const teacherSkills: SkillCard[] = [
  {
    id: "t-exam-skill",
    category: "Para professores",
    title: "Montador de provas",
    description: "Monta provas de inglês no formato escolar, prontas para usar.",
    tag: "provas",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/murilo-prova",
  },
  {
    id: "t-discussion-skill",
    category: "Para professores",
    title: "Perguntas para debate",
    description: "Gera perguntas para discutir na próxima aula.",
    tag: "aula",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/perguntas-para-aula",
  },
  {
    id: "t-lesson-skill",
    category: "Para professores",
    title: "Planos de aula",
    description: "Transforma um tema em plano de aula com tempo e atividades.",
    tag: "aulas",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/teaching-lesson-plan",
  },
  {
    id: "t-retrieval-skill",
    category: "Para professores",
    title: "Revisão rápida",
    description: "Quizzes curtos de revisão em vários níveis.",
    tag: "revisão",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/retrieval-practice-generator",
  },
  {
    id: "t-vocab-skill",
    category: "Para professores",
    title: "Níveis de vocabulário",
    description: "Separa as palavras de um texto por nível, para ensinar primeiro o essencial.",
    tag: "vocabulário",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/vocabulary-tiering-tool",
  },
  {
    id: "t-worksheet-skill",
    category: "Para professores",
    title: "Atividades",
    description: "Worksheets e lição de casa de vocabulário, prontas para preencher.",
    tag: "atividades",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/licao-de-casa",
  },
  {
    id: "t-roteirista",
    category: "Para professores",
    title: "Roteirista de aulas",
    description: "Transforma uma ideia solta em roteiro completo, pronto para gravar.",
    tag: "roteiros",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/roteirista-aulas",
  },
  {
    id: "t-homework",
    category: "Para professores",
    title: "Homework",
    description: "Gera lição de casa a partir da página Notion: gap fill, match, true ou false.",
    tag: "lição de casa",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/homework",
  },
  {
    id: "t-corretor",
    category: "Para professores",
    title: "Corretor",
    description: "Corrige a lição do aluno direto na página Notion, com conferência de gabarito.",
    tag: "correção",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/corretor",
  },
  {
    id: "t-elvis",
    category: "Para professores",
    title: "Elvis",
    description: "Gera o áudio da lição e anexa na página Notion.",
    tag: "áudio",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/elvis",
  },
  {
    id: "t-imager",
    category: "Para professores",
    title: "Imager",
    description: "Ilustra a lição com fotos gratuitas, uma por cena.",
    tag: "imagens",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/imager",
  },
  {
    id: "t-notion",
    category: "Para professores",
    title: "Notion bonito",
    description: "Deixa sua página Notion bonita: callouts, colunas, títulos coloridos e tabelas.",
    tag: "notion",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/notion-beautifier",
  },
];

const PROMPT_GROUP_ORDER = ["Workshop", "Para professores", "Criar e modificar"];

const agentSkills: SkillCard[] = [
  {
    id: "a-dicien",
    category: "Agentes",
    title: "Dicien",
    description: "Dicionário inglês-português. É só digitar a palavra: tradução + exemplos.",
    tag: "agente",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/dicien.md",
  },
  {
    id: "a-dicifr",
    category: "Agentes",
    title: "Dicifr",
    description: "Dicionário francês-português. É só digitar a palavra: tradução + exemplos.",
    tag: "agente",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/dicifr.md",
  },
  {
    id: "a-diciit",
    category: "Agentes",
    title: "Diciit",
    description: "Dicionário italiano-português. É só digitar a palavra: tradução + exemplos.",
    tag: "agente",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/diciit.md",
  },
  {
    id: "a-visu",
    category: "Agentes",
    title: "Visu",
    description: "Transforma qualquer tema em visual: slides, infográficos, timelines.",
    tag: "agente",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/visu.md",
  },
  {
    id: "a-prompter",
    category: "Agentes",
    title: "Prompter",
    description: "Pega seu rascunho de prompt fraco e devolve uma versão pronta para colar.",
    tag: "agente",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/prompter.md",
  },
  {
    id: "a-examinador",
    category: "Agentes",
    title: "Examinador",
    description: "Clona sua prova modelo de proficiência e gera simulados novos com conteúdo novo, no mesmo formato.",
    tag: "agente",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/examinador.md",
  },
];

const SKILL_GROUP_ORDER = ["Para professores", "Agentes"];

function groupByCategory<T extends { category: string }>(items: T[], order: string[]) {
  return order
    .map((category) => ({ category, items: items.filter((item) => item.category === category) }))
    .filter((group) => group.items.length > 0);
}

function OpenCodeLibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("prompts");

  const promptGroups = groupByCategory([...workshopPrompts, ...teacherPrompts, ...builderPrompts], PROMPT_GROUP_ORDER);
  const skillGroups = groupByCategory([...teacherSkills, ...agentSkills], SKILL_GROUP_ORDER);

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-[900px] px-4 pt-6 md:pt-10">
        <HeroCard />
        <HowToUseCard />

        <section aria-label={activeTab === "prompts" ? "Prompts" : "Skills e agentes"} className="mt-8">
          {activeTab === "prompts" ? (
            <div className="flex flex-col gap-8">
              {promptGroups.map((group) => (
                <CategoryBlock key={group.category} label={group.category}>
                  {group.items.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </CategoryBlock>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {skillGroups.map((group) => (
                <CategoryBlock key={group.category} label={group.category}>
                  {group.items.map((skill) => (
                    <SkillCardComponent key={skill.id} skill={skill} />
                  ))}
                </CategoryBlock>
              ))}
            </div>
          )}
        </section>

        <FinalCTA />
      </main>
    </div>
  );
}

function TopBar({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (tab: Tab) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[900px] flex-col items-start justify-between gap-4 px-4 py-4 md:flex-row md:items-center">
        <span className="font-display text-lg font-bold text-foreground">Biblioteca OpenCode</span>

        <nav
          role="tablist"
          aria-label="Seções"
          className="flex w-full gap-2 md:w-auto"
        >
          <TabButton active={activeTab === "prompts"} onClick={() => onTabChange("prompts")}>
            Prompts
          </TabButton>
          <TabButton active={activeTab === "skills"} onClick={() => onTabChange("skills")}>
            Skills e agentes
          </TabButton>
        </nav>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-input bg-transparent text-foreground hover:bg-secondary"
      )}
    >
      {children}
    </button>
  );
}

function CategoryBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-bold uppercase tracking-[0.12em] text-foreground">{label}</h3>
      <div className="mt-3 flex flex-col gap-6">{children}</div>
    </div>
  );
}

function HeroCard() {
  return (
    <article className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-10">
      <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
        Workshop Material Autoral · para professores de idiomas
      </span>
      <h1 className="mt-4 font-display text-[48px] font-extrabold leading-[1.05] text-foreground md:text-[64px]">
        A Biblioteca{" "}
        <span className="font-editorial text-chai">OpenCode</span>
      </h1>
      <p className="mt-3 text-[17px] font-semibold text-foreground">copie, cole, faça seu.</p>
      <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-muted-foreground">
        Aqui estão os prompts, skills e agentes do workshop, prontos para usar.
        Abra a aba certa, copie o que precisa e cole no OpenCode.
      </p>
    </article>
  );
}

function HowToUseCard() {
  return (
    <article className="mt-6 rounded-[24px] bg-cream p-6 md:p-8">
      <h2 className="font-display text-2xl font-bold text-foreground">Como usar</h2>
      <ol className="mt-5 grid list-none gap-5 sm:grid-cols-3">
        <Step number="01" text="Abra a aba certa" />
        <Step number="02" text="Copie o cartão que precisa" />
        <Step number="03" text="Cole no OpenCode e veja funcionar" />
      </ol>
    </article>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex items-start gap-4">
      <span className="font-display text-[28px] font-bold text-chai">{number}</span>
      <p className="mt-1 text-[17px] font-semibold leading-snug text-foreground">{text}</p>
    </li>
  );
}

function PromptCard({ prompt }: { prompt: PromptCard }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(prompt.body);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
      <h3 className="font-display text-[28px] font-bold text-foreground">{prompt.title}</h3>
      <p className="mt-1 text-[17px] text-muted-foreground">{prompt.description}</p>

      <div className="relative mt-5 rounded-[20px] bg-ink p-5 md:p-6">
        <button
          onClick={handleCopy}
          className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-cream"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copiar prompt
            </>
          )}
        </button>
        <div className="pr-2 pt-8 md:pt-0 md:pr-28">
          <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-white">
            <PromptText text={prompt.body} />
          </p>
        </div>
      </div>
    </article>
  );
}

function PromptText({ text }: { text: string }) {
  const parts = text.split(/(\[.*?\])/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span key={index} className="text-chai">
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function SkillCardComponent({ skill }: { skill: SkillCard }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(skill.githubUrl);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="rounded-[24px] border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h3 className="font-display text-[28px] font-bold text-foreground">{skill.title}</h3>
          <p className="mt-1 text-[17px] text-muted-foreground">{skill.description}</p>
          <span className="mt-3 inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs font-semibold text-foreground">
            {skill.tag}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              copied
                ? "bg-espresso text-warm-beige"
                : "border border-input bg-transparent text-foreground hover:bg-secondary"
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
          <a
            href={skill.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Abrir link
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}

function FinalCTA() {
  return (
    <article className="mt-10 rounded-[24px] bg-ink p-6 text-warm-beige md:p-10">
      <span className="text-xs font-bold uppercase tracking-[0.15em] text-chai">Workshop Material Autoral</span>
      <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.1] md:text-[40px]">
        Copie, cole,{" "}
        <span className="font-editorial text-chai">faça seu</span>.
      </h2>
      <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-warm-beige/80">
        Pegue o que funciona. Ignore o resto. Monte seu fluxo no OpenCode, uma cópia de cada vez.
      </p>
      <div className="mt-8 border-t border-warm-beige/10 pt-6">
        <p className="text-sm font-semibold text-warm-beige/90">Chris Castelli · @profchriscastelli</p>
      </div>
    </article>
  );
}