import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The OpenCode Library" },
      { name: "description", content: "Copy, paste, make them yours. The resource page for paid subscribers of OpenCode by Chris Castelli." },
      { property: "og:title", content: "The OpenCode Library" },
      { property: "og:description", content: "Copy, paste, make them yours. The resource page for paid subscribers of OpenCode by Chris Castelli." },
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
    description: "Flashcards clicáveis do seu tema, prontos para projetar em aula.",
    body: `Crie um arquivo HTML único (CSS e JS dentro do próprio arquivo, sem dependências externas) de flashcards interativos para minha turma:

- Idioma: [INGLÊS]
- Nível: [A1]
- Tema: [comparatives, cheap/cheaper, tall/taller]
- Quantidade: [30] cards

Regras do material:
1. Cada card tem FRENTE (palavra base) e VERSO (resposta + tradução curta em pt-BR).
2. Clique vira o card (efeito flip). Inclua botão de embaralhar e filtros por grupo.
3. Visual simples para projetar: fundo claro, fonte grande, 1 instrução no topo.
4. No topo: título + nível + meu nome [@profchriscastelli].
5. No final: 1 dica de uso em aula em 2 linhas.
6. Salve como atividade-[tema].html e me diga como abrir e imprimir em PDF.`,
  },
  {
    id: "w-prova",
    category: "Workshop",
    title: "Prova com gabarito",
    description: "Prova justa de 30 minutos + gabarito com critérios de correção.",
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
    description: "Ficha A1 em 5 blocos no seu molde, pronta para A4 paisagem.",
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

Formato: HTML único + CSS inline, pronto para A4 paisagem, com badge "Nível A1" e assinatura @profchriscastelli. Salve como ficha-[tema].html e me diga como gerar o PDF.`,
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
    category: "For teachers",
    title: "Make a worksheet",
    description: "A ready worksheet for your class, with space to fill in.",
    body: `Make a worksheet about [TOPIC] for [AGE OR LEVEL]. Mix exercise types, like multiple choice, fill in the blanks, matching and a short writing task, and leave space for students to write their answers. Keep the instructions in English and simple enough for the level. Save it as a printable file, with the answer key at the end so students don't see it.`,
  },
  {
    id: "t-exam",
    category: "For teachers",
    title: "Build an exam",
    description: "An English exam in the school format, ready to use.",
    body: `Build an exam about [TOPIC] for [LEVEL]. Use multiple choice questions, numbered tasks with their point values marked, and a reading section with a short text and questions about it. Note the total score at the top. Save it as a printable file, with the answer key at the end, clearly separated so it's not on the student's copy.`,
  },
  {
    id: "t-discussion",
    category: "For teachers",
    title: "Discussion questions",
    description: "Questions that make the next class actually talk.",
    body: `Based on [MATERIAL], give me questions to discuss in the next class. Make them open-ended so students can't answer with just yes or no: a few about understanding the material, a few asking for opinions, and one or two that connect it to their own lives. Give me around ten, grouped by theme, and flag the two that will spark the most debate.`,
  },
  {
    id: "t-lesson",
    category: "For teachers",
    title: "Plan a lesson",
    description: "A structured lesson, from topic to activity to assessment.",
    body: `Turn [TOPIC] into a lesson plan for [AGE OR LEVEL]. Start with one clear learning objective. Then give me the plan in time blocks: a short opener, two or three main activities, and a quick wrap-up, with the minutes for each and what I need to prepare. End with a one-line assessment I can use to see if the lesson worked.`,
  },
  {
    id: "t-retrieval",
    category: "For teachers",
    title: "Retrieval opener",
    description: "A quick quiz to start the lesson and see what stuck.",
    body: `Make a quick retrieval quiz on [TOPIC] to start the lesson. Five questions, going from easy to harder, mixing types like fill in the blank, multiple choice and one recall question. Keep it under five minutes. Put the answers at the end so I can mark it quickly.`,
  },
  {
    id: "t-game",
    category: "For teachers",
    title: "Build me a game",
    description: "Make a simple game, for whatever you need it for.",
    body: `Make a game for me. Keep it simple and fun, and build it as a single file I can open without installing anything. Tell me how to open it. I'll tell you what I want it for. When I send you new ideas, add them to the same game instead of starting over, and test it after each change so nothing breaks.`,
  },
];

const teacherSkills: SkillCard[] = [
  {
    id: "t-dic-en",
    category: "For teachers",
    title: "English dictionary",
    description: "Defines English words with Portuguese translation, and Portuguese words with English definition + example.",
    tag: "dictionary",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/dicionario-ingles",
  },
  {
    id: "t-dic-fr",
    category: "For teachers",
    title: "French dictionary",
    description: "Defines French words with Portuguese translation, and Portuguese words with French definition + example.",
    tag: "dictionary",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/dicionario-frances",
  },
  {
    id: "t-dic-it",
    category: "For teachers",
    title: "Italian dictionary",
    description: "Defines Italian words with Portuguese translation, and Portuguese words with Italian definition + example.",
    tag: "dictionary",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/dicionario-italiano",
  },
  {
    id: "t-exam-skill",
    category: "For teachers",
    title: "Exam builder",
    description: "Builds English exams in the school format, ready to use.",
    tag: "tests",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/murilo-prova",
  },
  {
    id: "t-discussion-skill",
    category: "For teachers",
    title: "Discussion questions",
    description: "Generates discussion questions for your next class.",
    tag: "class",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/perguntas-para-aula",
  },
  {
    id: "t-lesson-skill",
    category: "For teachers",
    title: "Lesson plans",
    description: "Turns a topic into a structured lesson plan with timing and activities.",
    tag: "lessons",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/teaching-lesson-plan",
  },
  {
    id: "t-retrieval-skill",
    category: "For teachers",
    title: "Retrieval practice",
    description: "Quick revision quizzes at different difficulties.",
    tag: "revision",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/retrieval-practice-generator",
  },
  {
    id: "t-vocab-skill",
    category: "For teachers",
    title: "Vocabulary tiers",
    description: "Sorts the words in a text into everyday, academic and technical, so you know what to teach first.",
    tag: "vocabulary",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/vocabulary-tiering-tool",
  },
  {
    id: "t-worksheet-skill",
    category: "For teachers",
    title: "Worksheets",
    description: "Student worksheets and vocabulary homework, ready to fill in.",
    tag: "worksheets",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/licao-de-casa",
  },
  {
    id: "t-roteirista",
    category: "For teachers",
    title: "Roteirista de aulas",
    description: "Turns a raw idea into a full recording-ready lesson script, in Portuguese.",
    tag: "scripts",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/roteirista-aulas",
  },
  {
    id: "t-homework",
    category: "For teachers",
    title: "Homework",
    description: "Generates lesson homework from a Notion page: gap fill, match, true or false.",
    tag: "homework",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/homework",
  },
  {
    id: "t-corretor",
    category: "For teachers",
    title: "Corretor",
    description: "Corrects student homework inline on a Notion page, including gabarito check.",
    tag: "correction",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/corretor",
  },
  {
    id: "t-elvis",
    category: "For teachers",
    title: "Elvis",
    description: "Generates lesson audio with ElevenLabs and attaches it to the Notion page.",
    tag: "audio",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/elvis",
  },
  {
    id: "t-imager",
    category: "For teachers",
    title: "Imager",
    description: "Illustrates a Notion lesson with free stock photos, one per scene.",
    tag: "images",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/tree/main/skills/imager",
  },
];

const PROMPT_GROUP_ORDER = ["Workshop", "For teachers"];

const agentSkills: SkillCard[] = [
  {
    id: "a-dicien",
    category: "Agents",
    title: "Dicien agent",
    description: "English-Portuguese dictionary agent. Just type the word, get translation + examples.",
    tag: "agent",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/dicien.md",
  },
  {
    id: "a-dicifr",
    category: "Agents",
    title: "Dicifr agent",
    description: "French-Portuguese dictionary agent. Just type the word, get translation + examples.",
    tag: "agent",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/dicifr.md",
  },
  {
    id: "a-diciit",
    category: "Agents",
    title: "Diciit agent",
    description: "Italian-Portuguese dictionary agent. Just type the word, get translation + examples.",
    tag: "agent",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/diciit.md",
  },
  {
    id: "a-visu",
    category: "Agents",
    title: "Visu agent",
    description: "Turns any topic or notes into an interactive visual: decks, infographics, timelines.",
    tag: "agent",
    githubUrl: "https://github.com/chrisprofessora1-pixel/workshop-profs-idiomas-skills-e-prompts/blob/main/agents/visu.md",
  },
];

const SKILL_GROUP_ORDER = ["For teachers", "Agents"];

function groupByCategory<T extends { category: string }>(items: T[], order: string[]) {
  return order
    .map((category) => ({ category, items: items.filter((item) => item.category === category) }))
    .filter((group) => group.items.length > 0);
}

function OpenCodeLibraryPage() {
  const [activeTab, setActiveTab] = useState<Tab>("prompts");

  const promptGroups = groupByCategory([...workshopPrompts, ...teacherPrompts], PROMPT_GROUP_ORDER);
  const skillGroups = groupByCategory([...teacherSkills, ...agentSkills], SKILL_GROUP_ORDER);

  return (
    <div className="min-h-screen bg-background pb-24">
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-[900px] px-4 pt-6 md:pt-10">
        <HeroCard />
        <HowToUseCard />

        <section aria-label={activeTab === "prompts" ? "Prompts" : "Skills"} className="mt-8">
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
        <span className="font-display text-lg font-bold text-foreground">The OpenCode Library</span>

        <nav
          role="tablist"
          aria-label="Resource sections"
          className="flex w-full gap-2 md:w-auto"
        >
          <TabButton active={activeTab === "prompts"} onClick={() => onTabChange("prompts")}>
            Prompts
          </TabButton>
          <TabButton active={activeTab === "skills"} onClick={() => onTabChange("skills")}>
            Skills
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
        Workshop Material Autoral · for language teachers
      </span>
      <h1 className="mt-4 font-display text-[48px] font-extrabold leading-[1.05] text-foreground md:text-[64px]">
        The OpenCode{" "}
        <span className="font-editorial text-chai">Library</span>
      </h1>
      <p className="mt-3 text-[17px] font-semibold text-foreground">copy, paste, make them yours.</p>
      <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-muted-foreground">
        This is where workshop teachers grab the exact prompts, skills and agents from the class.
        No fluff. Just open the right tab, copy what you need, and paste it in.
      </p>
    </article>
  );
}

function HowToUseCard() {
  return (
    <article className="mt-6 rounded-[24px] bg-cream p-6 md:p-8">
      <h2 className="font-display text-2xl font-bold text-foreground">How to use</h2>
      <ol className="mt-5 grid list-none gap-5 sm:grid-cols-3">
        <Step number="01" text="Open the right tab" />
        <Step number="02" text="Copy the card you need" />
        <Step number="03" text="Paste it into OpenCode and watch it work" />
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
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy prompt
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
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={skill.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open link
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
        Copy, paste,{" "}
        <span className="font-editorial text-chai">make them yours</span>.
      </h2>
      <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-warm-beige/80">
        Take what works. Ignore what doesn't. Build your own OpenCode workflow, one copy at a time.
      </p>
      <div className="mt-8 border-t border-warm-beige/10 pt-6">
        <p className="text-sm font-semibold text-warm-beige/90">Chris Castelli · @profchriscastelli</p>
      </div>
    </article>
  );
}