export type Lang = "es" | "en";
type T = Record<Lang, string>;

// src: the main photo or clip (a key of src/media.json); dir: folder whose files fill the project sheet gallery;
// contain: show it whole (logos, screenshots) instead of cropping it to fill the box
type Shown = { src?: string; dir?: string; contain?: boolean };
export type Project = { name: string; role?: T; text: T; media: T; href?: string } & Shown;
export type SmallProject = { name: string; text: T; href?: string } & Shown;

export const ui = {
    tagline: { es: "Ingeniería en robótica. Hago robots, la liga donde compiten y los sitios web a su alrededor.", en: "Robotics engineering. I build robots, the league they compete in, and the websites around them." },
    loading: { es: "Cargando", en: "Loading" },
    visit: { es: "Ver proyecto", en: "View project" },
    more: { es: "Más proyectos", en: "More projects" },
    about: { es: "Sobre mí", en: "About" },
    awards: { es: "Premios", en: "Awards" },
    contact: { es: "Escríbeme", en: "Write to me" },
    work: { es: "Proyectos", en: "Work" },
    contactNav: { es: "Contacto", en: "Contact" },
    menu: { es: "Menú", en: "Menu" },
    close: { es: "Cerrar", en: "Close" },
    next: { es: "Siguiente", en: "Next" },
    prev: { es: "Anterior", en: "Previous" },
    info: { es: "Más información", en: "More info" },
} satisfies Record<string, T>;

// pieces without src stay a labelled placeholder until there is material for them
export const collage: { x: number; y: number; w: number; h: number; r: number; d: number; accent?: boolean; label: T; src?: string }[] = [
    { x: 5, y: 12, w: 24, h: 30, r: -6, d: 30, accent: true, label: { es: "Blue Ignition en la cancha, FRC 2024", en: "Blue Ignition at the field, FRC 2024" }, src: "blueignition/2024/pic/IMG_0412" },
    { x: 64, y: 8, w: 28, h: 24, r: 4, d: 50, label: { es: "Partido de MechaLeague", en: "MechaLeague match" }, src: "mechaleague/vid/MVI_3264" },
    { x: 3, y: 58, w: 22, h: 28, r: 5, d: 20, label: { es: "Robots en la cancha de MechaLeague", en: "Robots on the MechaLeague field" }, src: "mechaleague/pic/IMG_3270" },
    { x: 70, y: 54, w: 26, h: 30, r: -4, d: 40, accent: true, label: { es: "Galería de soulofmexico.ca", en: "soulofmexico.ca gallery" }, src: "soulofmexico/pic/desktop-06" },
    { x: 34, y: 6, w: 16, h: 18, r: 8, d: 15, label: { es: "Cargando el robot 2024 en el pit", en: "Carrying the 2024 robot in the pit" }, src: "blueignition/2024/pic/IMG_3146" },
    { x: 40, y: 74, w: 22, h: 20, r: -3, d: 35, label: { es: "Robot de MechaLeague andando", en: "MechaLeague robot driving" }, src: "mechaleague/vid/MVI_3325" },
    { x: 22, y: 38, w: 13, h: 15, r: 10, d: 60, accent: true, label: { es: "Robot de MechaLeague", en: "MechaLeague robot" }, src: "mechaleague/pic/IMG_2942" },
    { x: 60, y: 34, w: 15, h: 18, r: -9, d: 25, label: { es: "El equipo 3526 en el pit, 2025", en: "Team 3526 in the pit, 2025" }, src: "blueignition/2025/pic/IMG_6506" },
];

export const projects: Project[] = [
    {
        name: "MechaLeague",
        src: "mechaleague/vid/MVI_3268",
        dir: "mechaleague/",
        role: { es: "Fundador y líder de proyecto, 2024 a hoy", en: "Founder and project lead, 2024 to now" },
        text: { es: "Una competencia de robótica que cualquier estudiante puede entrar, con robots y sistema de control hechos de piezas comerciales fáciles de conseguir.", en: "A robotics competition any student can enter, with robots and a control system built from easy-to-find off-the-shelf parts." },
        media: { es: "Partido de MechaLeague", en: "MechaLeague match" },
        href: "https://mechaleague.site",
    },
    {
        name: "Blue Ignition 3526",
        src: "blueignition/2025/pic/IMG_6210",
        dir: "blueignition/",
        role: { es: "Líder de software 2022 a 2025, mentor desde 2025", en: "Software lead 2022 to 2025, mentor since 2025" },
        text: { es: "Equipo de FIRST Robotics Competition en Saltillo. Programé los robots de 2023 a 2025: Baymax, el robot 2024 y BlueIgnacio.", en: "FIRST Robotics Competition team in Saltillo. I programmed the 2023 to 2025 robots: Baymax, the 2024 robot and BlueIgnacio." },
        media: { es: "BlueIgnacio, el robot 2025", en: "BlueIgnacio, the 2025 robot" },
        href: "https://ignition.blue",
    },
    {
        name: "Soul of Mexico",
        src: "soulofmexico/vid/soulofmexico-scroll",
        dir: "soulofmexico/",
        text: { es: "Sitio bilingüe para la asociación sin fines de lucro de Calgary que representa a México en el Calgary Stampede.", en: "Bilingual site for the Calgary non-profit that represents Mexico at the Calgary Stampede." },
        media: { es: "Recorrido por soulofmexico.ca", en: "Scrolling through soulofmexico.ca" },
        href: "https://www.soulofmexico.ca",
    },
    {
        name: "STEMu",
        text: { es: "App de escritorio que separa canciones en voz e instrumentos, con modelos de 1, 4 y 5 stems y vista previa.", en: "Desktop app that splits songs into vocals and instruments, with 1, 4 and 5 stem models and a preview." },
        media: { es: "STEMu separando canciones en stems", en: "STEMu splitting songs into stems" },
        src: "stemu/pic/image",
        dir: "stemu/",
        contain: true,
        href: "https://github.com/ramondeleonca/stemu",
    },
    {
        name: "Korus lyrics",
        text: { es: "KXLRC y KSRT: formatos para letras sincronizadas y karaoke, con parser, serializador y reproductor.", en: "KXLRC and KSRT: formats for synced lyrics and karaoke, with a parser, stringifier and player." },
        media: { es: "Logo de Korus", en: "Korus logo" },
        src: "korus/pic/logo",
        dir: "korus/",
        contain: true,
        href: "https://github.com/ramondeleonca/kxlrc",
    },
];

export const smallProjects: SmallProject[] = [
    { name: "MechaLib", src: "mechalib/pic/MechaLibLogo200", dir: "mechalib/", contain: true, text: { es: "La librería para programar robots de MechaLeague.", en: "The library for programming MechaLeague robots." }, href: "https://ramondeleonca.github.io/MechaLib/" },
    { name: "Match Management System", src: "matchmanagementsystem/pic/SPLASH", dir: "matchmanagementsystem/", contain: true, text: { es: "Controla los partidos de MechaLeague y sincroniza los robots.", en: "Runs MechaLeague matches and syncs the robots." }, href: "https://github.com/ramondeleonca/MechaLeague-MMS" },
    { name: "MechaTag", text: { es: "Cámara con AprilTags que ubica a los robots en la cancha.", en: "AprilTag camera that locates robots on the field." }, href: "https://github.com/ramondeleonca/mechatag" },
    { name: "MechaLeague Robot", src: "mechaleaguebot/vid/mechaleague-bot", dir: "mechaleaguebot/", text: { es: "Plataforma de robot open source con ESP32 y Arduino.", en: "Open source ESP32 and Arduino robot platform." }, href: "https://github.com/ramondeleonca/MechaLeague-Bot" },
    { name: "BlueScout", text: { es: "Apps de scouting para competencias FRC.", en: "Scouting apps for FRC events." }, href: "https://github.com/ramondeleonca/bluescout-pwa" },
    { name: "ignition.blue", text: { es: "El sitio web del equipo 3526.", en: "Team 3526's website." }, href: "https://ignition.blue" },
    { name: "Ana Martín", text: { es: "Portafolio para una artista y diseñadora.", en: "Portfolio for an artist and designer." }, href: "https://ana-martin-artist.vercel.app" },
    { name: "TFT_eGUI", text: { es: "Framework para interfaces ligeras y reactivas en pantallas TFT.", en: "Framework for lightweight, reactive TFT interfaces." }, href: "https://github.com/ramondeleonca/TFT_eGUI" },
    { name: "Spotidry", text: { es: "Descargador de música de Spotify.", en: "Spotify music downloader." }, href: "https://github.com/ramondeleonca/Spotidry" },
    { name: "BitPhoton", text: { es: "Sensor de luz con WiFi y CAN para BitBot.", en: "WiFi and CAN light sensor for BitBot." }, href: "https://github.com/BitBot-Automation/BitPhoton" },
    { name: "B-Comfy", text: { es: "App y dispositivo ESP32, finalista PrepAPPs TEC 2024.", en: "App and ESP32 device, PrepAPPs TEC 2024 finalist." }, href: "https://github.com/ramondeleonca/B-Comfy-App" },
    { name: "DECK", text: { es: "Controlador MIDI modular para DJ.", en: "Modular MIDI DJ controller." } },
    { name: "Coahuila Creations", text: { es: "Sitio web.", en: "Website." }, href: "https://coahuilacreations.xyz" },
    { name: "Korus Tech", text: { es: "Sitio web.", en: "Website." }, href: "https://korus-tech.vercel.app" },
];

export const about: T = {
    es: "Estudio Ingeniería en Robótica y Sistemas Digitales en el Tec de Monterrey, Campus Saltillo. Me motiva usar la tecnología para generar impacto en la comunidad: lidero equipos de software y creé una competencia de robótica para que más jóvenes puedan participar. Hablo español, inglés (C1) y algo de alemán (A2).",
    en: "I study Robotics and Digital Systems Engineering at Tec de Monterrey, Saltillo campus. I like using technology to help my community: I lead software teams and created a robotics competition so more young people can take part. I speak Spanish, English (C1) and some German (A2).",
};

export const awards: { name: T; year: string }[] = [
    { name: { es: "Judges' Award, FRC Bayou Regional", en: "Judges' Award, FRC Bayou Regional" }, year: "2025" },
    { name: { es: "Semifinalista en FRC Monterrey, Laguna, Mexico All-Star y Bayou", en: "Semifinalist at FRC Monterrey, Laguna, Mexico All-Star and Bayou" }, year: "2024–2025" },
    { name: { es: "Finalista, PrepAPPs TEC", en: "Finalist, PrepAPPs TEC" }, year: "2024" },
    { name: { es: "Ganador Regional, FRC Laguna", en: "Regional Winner, FRC Laguna" }, year: "2023" },
];

export const links = [
    { name: "ramondeleonca@gmail.com", href: "mailto:ramondeleonca@gmail.com" },
    { name: "GitHub", href: "https://github.com/ramondeleonca" },
    { name: "LinkedIn", href: "https://linkedin.com/in/ramondeleonca" },
];

// URL piece for a small project: "Match Management System" -> "match-management-system", "Ana Martín" -> "ana-martin"
export const slug = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// everything the project sheet can show, big projects first, in page order
export const allProjects: (SmallProject & Partial<Project>)[] = [...projects, ...smallProjects];
