\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{gymmureport}[2024/05/16 Report für Gym Muttenz]

% Das wird hier bereits gebraucht um die Optionen zu verarbeiten.
\RequirePackage{pgfopts}

% Deklariere Optionen die wir für die Klasse verwenden können.
\newif\ifgymmureport@draft
\pgfkeys{
  /gymmureport/.cd,
  class/.store in   = \gmuclass,
  class              = 1A,
  school/.store in   = \gmuschool,
  school             = Gymnasium Muttenz,
  bibstyle/.store in = \gymmureport@bibstyle,
  bibstyle           = authoryear,
  draft/.code        = \gymmureport@drafttrue,
  .unknown/.code     = {%
    \edef\gymmureport@tmp{\pgfkeyscurrentname}%
    \expandafter\PassOptionsToClass\expandafter{\gymmureport@tmp}{report}%
  },
}

% Verarbeite die Klassen-Optionen über pgfkeys.
\ProcessPgfOptions{/gymmureport}\relax

% Lade die Basis-Klasse.
\LoadClass{report}

% Im Draft-Modus: Markiere overfull hboxes mit einem schwarzen Balken am Rand.
\ifgymmureport@draft
  \setlength{\overfullrule}{5pt}
\fi

% Fontencoding und Input-Encoding müssen vor babel geladen werden.
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}

% Importiere alle Pakete die in der Klasse verwendet werden sollen.
\RequirePackage{amsthm,amssymb,amsmath}
\RequirePackage{fancyhdr}
\RequirePackage[ngerman]{babel}
\RequirePackage{csquotes}
\ifgymmureport@draft
  \RequirePackage[plainpages=false,pdfpagelabels,final]{hyperref}
\else
  \RequirePackage[plainpages=false,pdfpagelabels,hidelinks]{hyperref}
\fi
\RequirePackage{graphicx}
\RequirePackage{caption}
\RequirePackage{float}

% Verwende todonotes für Notizen am Rand.
% Im Draft-Modus werden sie angezeigt, sonst ausgeblendet.
\ifgymmureport@draft
  \RequirePackage{todonotes}
\else
  \RequirePackage[disable]{todonotes}
\fi

% Definiere das Layout der Seite.
% Im Draft-Modus wird der rechte Rand breiter gelassen, damit todonotes
% und overfull-hbox-Markierungen Platz haben.
\ifgymmureport@draft
  \RequirePackage[
	paper=a4paper,
	top=2.7cm,
	bottom=2.7cm,
	left=1.6cm,
	right=4.6cm,
	marginparwidth=3.5cm,
	marginparsep=0.3cm,
	showframe]{geometry}
\else
  \RequirePackage[
	paper=a4paper,
	top=2.7cm,
	bottom=2.7cm,
	left=1.6cm,
	right=1.6cm]{geometry}
\fi

% Verwende und konfiguriere biblatex.
\RequirePackage[
	backend=biber,
	style=\gymmureport@bibstyle,
	sortlocale=de_DE,
	natbib=true,
	url=true,
	doi=false,
	sortcites=true,
	sorting=nyt,
	isbn=false,
	hyperref=true,
	backref=false,
	giveninits=false,
	eprint=false]{biblatex}


% Definiere das Abstract als eingerückten Block (nicht auf eigener Seite).
\renewenvironment{abstract}{%
  \small
  \begin{center}%
    {\bfseries \abstractname\vspace{-.5em}\vspace{\z@}}%
  \end{center}%
  \quotation
}{\endquotation}

% Bestimmt wie enums durchgezählt werden.
\renewcommand{\theenumi}{(\alph{enumi})}
\renewcommand{\labelenumi}{\theenumi}
\renewcommand{\theenumii}{(\roman{enumii})}
\renewcommand{\labelenumii}{\theenumii}

% Bestimmt wie items durchgezogen werden.
\renewcommand{\labelitemi}{$\Rightarrow$}
\renewcommand{\labelitemii}{$\circ$}

% Speichere den Autornamen, da \@author nach \maketitle zurückgesetzt wird.
% Verwende ausserdem \pagenumbering{Alph} für die Titelseite, damit hyperref
% keine doppelten Seitenziele (page.1) erzeugt.
\newcommand{\gmu@author}{}
\let\gmu@origmaketitle\maketitle
\renewcommand{\maketitle}{%
  \global\let\gmu@author\@author
  \pagenumbering{Alph}%
  \gmu@origmaketitle
  \thispagestyle{empty}%  Titelseite: keine Kopf-/Fusszeilen
  \pagenumbering{arabic}%
}

% Verwende fancyhdr um Kopf- und Fusszeilen zu erstellen.
\pagestyle{fancy}

% Dieser Befehl sorgt dafür das nur der Sectiontitel ohne Nummerierung angezeigt wird.
\renewcommand{\chaptermark}[1]{ \markboth{#1}{} }
\renewcommand{\sectionmark}[1]{ \markright{#1}{} }

% Definiere Kopf- und Fusszeilen
\fancyhf{}
\fancyhead[L]{Klasse: \gmuclass}
\fancyhead[R]{\leftmark} % Druckt den Titel des Abschnitts
\fancyfoot[C]{\thepage}
\fancyfoot[L]{\gmu@author}
\fancyfoot[R]{\gmuschool}

% Konfiguriere den 'plain'-Stil (wird auf Kapitelanfangsseiten verwendet).
% Gleiche Fusszeilen wie 'fancy', aber ohne Kopfzeile.
\fancypagestyle{plain}{%
  \fancyhf{}%
  \fancyfoot[C]{\thepage}%
  \fancyfoot[L]{\gmu@author}%
  \fancyfoot[R]{\gmuschool}%
  \renewcommand{\headrulewidth}{0pt}%
}