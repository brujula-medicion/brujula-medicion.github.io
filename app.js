/* ============================================================
   BRÚJULA DE LA MEDICIÓN · LÓGICA
   Los textos están en contenido.js y glosario.js.
   No se guarda nada: las respuestas viven en la dirección (#resultado?...).
   ============================================================ */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const FICHA = Object.fromEntries(FICHAS.map(f => [f.id, f]));
const guiaUrl = a => `${CONFIG.guia}#${a}`;
const urlAbs = rel => new URL(rel, location.href).href;
const fmt = (n, d = 0) => n.toLocaleString('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });

/* ---------- Modo claro / oscuro ---------- */
if (localStorage.getItem('modo') === 'oscuro') document.body.classList.add('oscuro');
$('#modo').onclick = () => {
  document.body.classList.toggle('oscuro');
  localStorage.setItem('modo', document.body.classList.contains('oscuro') ? 'oscuro' : 'claro');
  dibujarSim(); dibujarAds();
};

/* ---------- Navegación por la dirección (#vista) ---------- */
const VISTAS = ['inicio', 'brujula', 'resultado', 'fichas', 'comparador', 'mitos', 'simulador', 'evidencias', 'glosario', 'privacidad'];
function ruta() {
  const h = location.hash.slice(1);
  const [v, q] = h.split('?');
  return { vista: VISTAS.includes(v) ? v : 'inicio', params: new URLSearchParams(q || '') };
}
function irA() {
  const { vista, params } = ruta();
  $$('.vista').forEach(s => s.classList.add('oculto'));
  $(`#v-${vista}`).classList.remove('oculto');
  $$('.cabecera nav a.enlace, .menu-movil a').forEach(a => a.classList.toggle('activo', a.getAttribute('href') === `#${vista}`));
  ocultarBurbuja();
  if (vista === 'brujula') pintarPregunta();
  if (vista === 'resultado') pintarResultado(params);
  if (vista === 'simulador') { dibujarSim(); dibujarAds(); }
  if (vista === 'fichas' && params.get('tema')) filtrarFichas(params.get('tema'));
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', irA);

/* ---------- Glosario emergente ---------- */
const TERMINOS = GLOSARIO.flatMap(g => g.patrones.map(p => ({ id: g.id, re: new RegExp(`(?<![\\p{L}\\p{N}])(${p})(?![\\p{L}\\p{N}])`, 'iu'), largo: p.length })))
  .sort((a, b) => b.largo - a.largo);
const GLO = Object.fromEntries(GLOSARIO.map(g => [g.id, g]));

function glosar(raiz) {
  const usados = new Set();
  for (const t of TERMINOS) {
    if (usados.has(t.id)) continue;
    const andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.parentElement.closest('a,button,.term,h1,h2,h3,label,.etiqueta,.tipo,dt,th,script,canvas') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    let n;
    while ((n = andador.nextNode())) {
      const m = n.data.match(t.re);
      if (!m) continue;
      const ini = m.index, fin = ini + m[0].length;
      const span = document.createElement('span');
      span.className = 'term'; span.tabIndex = 0; span.dataset.g = t.id; span.textContent = m[0];
      span.setAttribute('role', 'button'); span.setAttribute('aria-label', `${m[0]}: ver definición`);
      const resto = n.splitText(ini); resto.data = resto.data.slice(fin - ini);
      n.parentNode.insertBefore(span, resto);
      usados.add(t.id);
      break;
    }
  }
}
const burbuja = document.createElement('div');
burbuja.className = 'burbuja oculto'; burbuja.setAttribute('role', 'tooltip');
document.body.appendChild(burbuja);
let burbujaDe = null;
function mostrarBurbuja(el) {
  const g = GLO[el.dataset.g]; if (!g) return;
  burbuja.innerHTML = `<b>${esc(g.termino)}</b>${esc(g.definicion)} <a href="${guiaUrl(g.id)}" target="_blank" rel="noopener">Ver en la guía →</a>`;
  burbuja.classList.remove('oculto');
  const r = el.getBoundingClientRect();
  const w = Math.min(320, window.innerWidth - 24);
  burbuja.style.maxWidth = w + 'px';
  let x = r.left + window.scrollX; x = Math.max(12, Math.min(x, window.scrollX + window.innerWidth - w - 12));
  burbuja.style.left = x + 'px';
  burbuja.style.top = (r.bottom + window.scrollY + 8) + 'px';
  burbujaDe = el;
}
function ocultarBurbuja() { burbuja.classList.add('oculto'); burbujaDe = null; }
let temporizador;
document.addEventListener('mouseover', e => { const t = e.target.closest('.term'); if (t) { clearTimeout(temporizador); mostrarBurbuja(t); } else if (e.target.closest('.burbuja')) clearTimeout(temporizador); });
document.addEventListener('mouseout', e => { if (e.target.closest('.term, .burbuja')) { temporizador = setTimeout(ocultarBurbuja, 300); } });
document.addEventListener('focusin', e => { const t = e.target.closest('.term'); if (t) mostrarBurbuja(t); });
document.addEventListener('click', e => {
  const t = e.target.closest('.term');
  if (t) { burbujaDe === t ? ocultarBurbuja() : mostrarBurbuja(t); return; }
  if (!e.target.closest('.burbuja')) ocultarBurbuja();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { ocultarBurbuja(); cerrarModal(); } });

/* ---------- Portada ---------- */
$('#p-ante').textContent = PORTADA.antetitulo;
$('#p-titulo').innerHTML = `${esc(PORTADA.titulo[0])}<span class="verde">${esc(PORTADA.titulo[1])}</span>`;
$('#p-intro').textContent = PORTADA.intro;
$('#p-datos').innerHTML = PORTADA.datos.map(d => `<div class="dato"><b>${esc(d.cifra)}</b><span>${esc(d.texto)}</span><small>${esc(d.fuente)}</small></div>`).join('');
$('#p-idea').textContent = PORTADA.idea;

/* ---------- Cuestionario ---------- */
let paso = 0;
const resp = {};
function pintarPregunta() {
  const q = PREGUNTAS[paso];
  $('#q-num').textContent = `Pregunta ${paso + 1} de ${PREGUNTAS.length}`;
  $('#q-barra').style.width = `${(paso + 1) / PREGUNTAS.length * 100}%`;
  const sel = resp[q.id];
  $('#q-cuerpo').innerHTML = `<h2>${esc(q.titulo)}</h2><p class="ayuda">${esc(q.ayuda)}</p>` +
    (q.multi ? '<p class="multi-aviso">Puedes marcar varias.</p>' : '') +
    `<div class="opciones">${q.opciones.map(o => {
      const on = q.multi ? (sel || []).includes(o.id) : sel === o.id;
      return `<button class="opcion" data-o="${o.id}" aria-pressed="${on}"><b>${esc(o.t)}</b><span>${esc(o.d)}</span></button>`;
    }).join('')}</div>`;
  glosar($('#q-cuerpo'));
  $$('.opcion', $('#q-cuerpo')).forEach(b => b.onclick = () => elegir(q, b.dataset.o));
  $('#q-atras').style.visibility = paso === 0 ? 'hidden' : 'visible';
  $('#q-sig').textContent = paso === PREGUNTAS.length - 1 ? 'Ver mi mapa de medición →' : 'Siguiente →';
  actualizarSiguiente();
}
function elegir(q, o) {
  if (q.multi) {
    let v = resp[q.id] || [];
    if (o === 'pocos') v = v.includes('pocos') ? [] : ['pocos'];
    else { v = v.filter(x => x !== 'pocos'); v = v.includes(o) ? v.filter(x => x !== o) : [...v, o]; }
    resp[q.id] = v;
    pintarPregunta();
  } else {
    resp[q.id] = o;
    pintarPregunta();
    setTimeout(siguiente, 250);
  }
}
function actualizarSiguiente() {
  const q = PREGUNTAS[paso], v = resp[q.id];
  $('#q-sig').disabled = q.multi ? !(v && v.length) : !v;
}
function siguiente() {
  const q = PREGUNTAS[paso], v = resp[q.id];
  if (q.multi ? !(v && v.length) : !v) return;
  if (paso < PREGUNTAS.length - 1) { paso++; pintarPregunta(); window.scrollTo(0, 0); }
  else {
    const p = new URLSearchParams({ s: resp.saber, d: resp.decision, m: resp.medios.join(','), da: resp.datos.join(','), h: resp.horizonte, p: resp.papel });
    location.hash = `resultado?${p}`;
  }
}
$('#q-sig').onclick = siguiente;
$('#q-atras').onclick = () => { if (paso > 0) { paso--; pintarPregunta(); } };

/* ---------- Reglas: de las respuestas a la recomendación ---------- */
const NOMBRE = { saber: {}, decision: {}, medios: {}, datos: {}, horizonte: {}, papel: {} };
PREGUNTAS.forEach(q => q.opciones.forEach(o => NOMBRE[q.id][o.id] = o.t));
const FAM_MMM = ['mmm', 'simulacion', 'largo'];

function recomendar(r) {
  const m = r.medios, da = r.datos;
  const offline = m.includes('offline'), digital = m.includes('digital') || m.includes('walled'), walled = m.includes('walled');
  const soloDigital = digital && !offline;
  const hist = da.includes('historico'), region = da.includes('region'), recorridos = da.includes('recorridos'), marca = da.includes('marca');
  const porque = [], avisos = [], extra = [];
  let dec = r.decision;

  if (dec === 'nose') {
    dec = { funciona: 'funciona', cuanto: 'reparto', mejor: soloDigital ? 'tactica' : 'reparto', reparto: 'reparto' }[r.saber];
    porque.push(`Aún no tienes clara la decisión, así que partimos de lo que quieres saber: «${NOMBRE.saber[r.saber]}».`);
  } else porque.push(`Quieres «${NOMBRE.decision[dec].toLowerCase()}».`);

  // Experimento que mejor encaja con sus datos y medios
  const experimento = region ? 'geo' : (soloDigital ? 'lift' : 'cuasi');
  const porqueExp = region ? 'tienes resultados por región (geoexperimento)' : (soloDigital ? 'tu inversión es digital (test de incrementalidad de plataforma)' : 'no tienes datos por región (diseño cuasi-experimental a partir de cambios ya ocurridos)');

  let principal, apoyo, apoyoNota = '';
  switch (dec) {
    case 'tactica':
      if (!digital) {
        // Solo offline: la atribución digital no ve nada. La táctica se hace con un MMM por subcanal y con experimentos.
        principal = 'mmm'; apoyo = experimento;
        apoyoNota = `Para probar cambios concretos (cadenas, franjas, emplazamientos, creatividades) y medir su efecto: ${porqueExp}.`;
        porque.push('Solo inviertes en medios offline: la atribución digital no los ve. Para optimizarlos, el MMM baja al detalle de subcanal (cadena, franja, formato) cuando hay datos suficientes.');
        extra.push('creatividad');
      } else if (!recorridos) {
        principal = 'lift'; apoyo = 'testab'; apoyoNota = 'Para optimizar elementos concretos (creatividades, mensajes, páginas de destino) con rigor causal.';
        porque.push('No tienes recorridos digitales con consentimiento: la atribución basada en datos no tendría de dónde aprender, así que empezamos por los experimentos de las plataformas.');
      } else { principal = 'dda'; apoyo = 'testab'; apoyoNota = 'Para optimizar elementos concretos con rigor causal.'; }
      break;
    case 'reparto': principal = 'mmm'; apoyo = experimento; apoyoNota = `Para calibrar el MMM en el medio con más incertidumbre: ${porqueExp}.`; break;
    case 'creatividad':
      if (soloDigital) { principal = 'testab'; apoyo = 'lift'; apoyoNota = 'Un brand lift mide si la campaña mueve la notoriedad o la intención.'; porque.push('Tu inversión es digital: el test A/B es la primera opción para comparar piezas.'); }
      else { principal = 'creatividad'; apoyo = 'mmm'; apoyoNota = 'Si las creatividades han variado lo suficiente en el tiempo, el MMM también puede medir su efecto.'; }
      break;
    case 'planificacion': principal = 'simulacion'; apoyo = experimento; apoyoNota = `Para validar los escenarios: ${porqueExp}.`; break;
    case 'marca': principal = 'largo'; apoyo = region ? 'geo' : 'cuasi'; apoyoNota = region ? 'Un test de apagado por regiones mide qué pasa cuando dejas de invertir.' : 'Aprovecha cambios ya ocurridos (un parón, una región que empezó antes) para medir el efecto de apagar.'; if (marca) porque.push('Tienes estudios de marca: sirven como indicadores intermedios en el modelo.'); else extra.push('fullfunnel'); break;
    case 'funciona': principal = (region || offline) ? (region ? 'geo' : 'cuasi') : 'lift'; apoyo = hist ? 'mmm' : 'cuasi'; if (apoyo === principal) apoyo = 'mmm'; apoyoNota = 'El experimento dice si funciona; el MMM, cuánto aporta cada medio en el conjunto.'; porque.push('Para saber si funciona, la mejor respuesta es un experimento: mide causalidad, no correlación.'); break;
  }

  if (offline && !porque.some(x => x.startsWith('Solo inviertes en medios offline'))) porque.push('Inviertes en TV, radio, exterior, prensa o cine: la atribución digital no los ve.');
  if (soloDigital) porque.push('Tu inversión es solo digital.');

  // Sin histórico, el MMM pasa a ser el objetivo y se empieza por un experimento
  if (FAM_MMM.includes(principal) && !hist) {
    avisos.push('Para un MMM fiable hacen falta dos o tres años de datos semanales de todos los medios y del negocio. Mientras los reúnes, empieza por un experimento.');
    apoyo = principal; principal = experimento === principal ? 'cuasi' : experimento;
    apoyoNota = 'Tu objetivo a medio plazo: empieza ya a ordenar los datos semanales para construirlo.';
    porque.push('No tienes todavía 2-3 años de datos semanales.');
  } else if (FAM_MMM.includes(principal)) porque.push('Tienes 2-3 años de datos semanales: suficiente para un MMM.');

  if (principal === 'dda' && offline) { avisos.push('La atribución digital solo ve los contactos digitales rastreables: no existen para ella la TV, la radio, el exterior ni la prensa. Para repartir entre todos los medios necesitarás un MMM.'); extra.push('mmm'); }
  if (principal === 'dda' && !recorridos) avisos.push('Sin recorridos digitales con consentimiento y volumen de conversiones, la atribución basada en datos no tiene de dónde aprender.');
  if (r.horizonte === 'semana' && (FAM_MMM.includes(principal) || ['geo', 'cuasi'].includes(principal))) avisos.push('Un MMM o un experimento no se resuelven en una semana. Para decidir ya, usa lo que tengas (estudios de plataforma, test A/B) sabiendo lo que no ven, y pon en marcha la medición para la próxima decisión.');
  if (r.horizonte === 'anos' && dec === 'tactica') { avisos.push('Tu horizonte es de años: la optimización táctica no captura el efecto de construcción de marca.'); extra.push('largo'); }
  if (walled) { avisos.push('Los estudios de cada plataforma miden su propia publicidad en su propio entorno. No sumes sus resultados: cada una se atribuye un mérito que es compartido.'); extra.push('walled'); }
  if (r.saber === 'funciona' && !['geo', 'lift', 'cuasi', 'testab'].includes(principal)) extra.push('causalidad');
  if (FAM_MMM.includes(principal) || FAM_MMM.includes(apoyo) || offline) extra.push('adstock');
  extra.push('integrada');

  // Errores que aplican
  const pesos = {
    registro: digital ? 1 + (dec === 'tactica' ? 2 : 0) + (r.saber === 'mejor' ? 1 : 0) + (offline ? 1 : 0) : 0,
    sumar: (walled ? 3 : 0) + (digital && ['reparto', 'tactica'].includes(dec) ? 1 : 0),
    largo: (dec === 'marca' ? 3 : 0) + (offline ? 1 : 0) + (['reparto', 'planificacion'].includes(dec) ? 1 : 0) + (r.horizonte === 'anos' ? 1 : 0),
    marginal: (['reparto', 'planificacion'].includes(dec) ? 2 : 0) + (r.saber === 'reparto' ? 1 : 0) + (r.papel === 'finanzas' ? 2 : 0),
    precision: (['finanzas', 'direccion'].includes(r.papel) ? 2 : 0) + (r.saber === 'cuanto' ? 1 : 0) + (!hist ? 1 : 0)
  };
  const errores = Object.entries(pesos).sort((a, b) => b[1] - a[1]).filter(([, p], i) => p > 0 || i < 2).slice(0, 3).map(([k]) => k);

  // Primeros pasos
  const pasos = ['preguntas'];
  if (!hist) pasos.push('datos');
  if (offline || dec === 'reparto' || walled) pasos.push('plataformas');
  if (FAM_MMM.includes(principal) || FAM_MMM.includes(apoyo)) pasos.push('mmm');
  pasos.push('experimentos');
  if (dec === 'marca' || offline || r.horizonte === 'anos') pasos.push('largo');
  if (['finanzas', 'direccion'].includes(r.papel)) pasos.push('incertidumbre', 'organizacion');
  else if (r.papel === 'marketing' || r.papel === 'medios') pasos.push('organizacion');

  const fichas = [...new Set([principal, apoyo, ...extra])];
  return { principal, apoyo, apoyoNota, avisos, porque, errores, pasos: [...new Set(pasos)].slice(0, 5), fichas, papel: PAPELES[r.papel] };
}

/* ---------- Resultado ---------- */
let ultimo = null;
const LUZ = ['No', 'A medias', 'Bien'];
function leerParams(p) {
  const r = { saber: p.get('s'), decision: p.get('d'), medios: (p.get('m') || '').split(',').filter(Boolean), datos: (p.get('da') || '').split(',').filter(Boolean), horizonte: p.get('h'), papel: p.get('p') };
  const ok = NOMBRE.saber[r.saber] && NOMBRE.decision[r.decision] && r.medios.length && r.datos.length && NOMBRE.horizonte[r.horizonte] && NOMBRE.papel[r.papel];
  return ok ? r : null;
}
function fichaHTML(f, destacada) {
  const pts = f.puntos.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  const extra = f.simulador ? '<a class="boton peq" href="#simulador">Abrir el simulador</a>' : (f.quiz ? '<a class="boton peq" href="#mitos">Hacer el test</a>' : '');
  return `<article class="ficha${destacada ? ' destacada' : ''}" id="ficha-${f.id}">
    <span class="tipo">${esc(f.tipo)}</span><h3>${esc(f.titulo)}</h3><dl>${pts}</dl>
    ${f.ejemplo ? `<div class="ejemplo">${esc(f.ejemplo)}</div>` : ''}
    <div class="pie-ficha"><a class="saber" href="${guiaUrl(f.ancla)}" target="_blank" rel="noopener">Saber más →</a>${extra}</div></article>`;
}
function semaforoHTML(ids) {
  const preg = [['funciona', '¿Funciona?'], ['cuanto', '¿Cuánto aporta?'], ['mejor', '¿Qué funciona mejor?'], ['reparto', '¿Qué hago ahora?']];
  return `<table class="semaforo"><thead><tr><th>Pregunta</th>${ids.map(i => `<th>${esc(FICHA[i].titulo.replace(/\s*\(.*\)/, ''))}</th>`).join('')}</tr></thead><tbody>` +
    preg.map(([k, t]) => `<tr><td>${t}</td>${ids.map(i => { const v = FICHA[i].luz[k]; return `<td class="luz"><i class="l${v}" title="${LUZ[v]}" aria-label="${LUZ[v]}"></i></td>`; }).join('')}</tr>`).join('') +
    `</tbody></table><div class="leyenda"><span><i class="l2"></i>Bien</span><span><i class="l1"></i>A medias</span><span><i class="l0"></i>No</span></div>`;
}
function eleccionesTexto(r) {
  const dec = r.decision === 'nose' ? 'Aún no sé qué decisión tomar' : NOMBRE.decision[r.decision];
  return [NOMBRE.saber[r.saber], dec, r.medios.map(x => NOMBRE.medios[x]).join(', '), r.datos.map(x => NOMBRE.datos[x]).join(', '),
    NOMBRE.horizonte[r.horizonte], NOMBRE.papel[r.papel]].join(' – ');
}
function pintarResultado(params) {
  const r = leerParams(params);
  if (!r) { location.hash = 'brujula'; return; }
  Object.assign(resp, r);
  const rec = recomendar(r); ultimo = { r, rec };
  const P = FICHA[rec.principal], A = FICHA[rec.apoyo];
  const resumen = P.puntos.find(p => p[0] === 'Responde');
  $('#r-cuerpo').innerHTML = `
    <p class="antetitulo">🧭 Brújula de la medición</p>
    <div class="titulo-mapa"><h2>Tu mapa de medición</h2><button class="boton principal" id="r-pdf-arriba">📄 Exportar a PDF</button></div>
    <div class="elecciones"><b>Tus respuestas:</b> ${esc(eleccionesTexto(r))} <a href="#brujula" id="r-cambiar">Cambiar</a></div>
    <div class="porque"><b>Porque has dicho que…</b> ${rec.porque.map(esc).join(' ')}</div>
    <div class="metodos">
      <div class="metodo principal"><span class="etiqueta">Método principal</span><h3>${esc(P.titulo)}</h3>
        <p>${esc(resumen ? resumen[1] : P.puntos[0][1])}</p><a class="saber" href="#ficha-${P.id}">Ver la ficha ↓</a></div>
      <div class="metodo apoyo"><span class="etiqueta">${FAM_MMM.includes(rec.apoyo) && !r.datos.includes('historico') ? 'Siguiente paso' : 'Lo apoyamos con'}</span><h3>${esc(A.titulo)}</h3>
        <p>${esc(rec.apoyoNota)}</p><a class="saber" href="#ficha-${A.id}">Ver la ficha ↓</a></div>
    </div>
    ${rec.avisos.map(a => `<div class="aviso">⚠️ ${esc(a)}</div>`).join('')}
    <div class="bloques">
      <div class="bloque"><h3>Qué responde cada uno</h3>${semaforoHTML([rec.principal, rec.apoyo])}</div>
      <div class="bloque"><h3>Cuidado con…</h3><ul class="errores">${rec.errores.map(e => `<li><b>${esc(ERRORES[e].t)}.</b> ${esc(ERRORES[e].d)}</li>`).join('')}</ul>
        <p style="margin:6px 0 0"><a class="saber" href="${guiaUrl('principales-errores-de-interpretacion')}" target="_blank" rel="noopener">Saber más →</a></p></div>
    </div>
    <div class="bloque" style="margin-top:16px"><h3>Tus primeros pasos</h3><ol class="pasos">${rec.pasos.map(p => `<li>${esc(PASOS[p])}</li>`).join('')}</ol>
      ${rec.papel ? `<p class="porque" style="margin:16px 0 0"><b>Para ti:</b> ${esc(rec.papel)}</p>` : ''}</div>
    <div class="barra-final">
      <button class="boton principal" id="r-pdf">📄 Exportar a PDF</button>
      <a class="boton" href="#brujula" id="r-reiniciar">Volver a empezar</a>
      <button class="boton" id="r-copiar">Copiar enlace a este resultado</button>
    </div>
    <div class="seccion" style="padding-bottom:0"><h2>Tus fichas</h2>
      <p class="suave">Lo que necesitas saber, en un minuto. «Saber más» te lleva al apartado de la guía.</p>
      <div class="fichas">${rec.fichas.map((id, i) => fichaHTML(FICHA[id], i < 2)).join('')}</div></div>`;
  glosar($('#r-cuerpo'));
  $('#r-pdf').onclick = exportar; $('#r-pdf-arriba').onclick = exportar;
  $('#r-cambiar').onclick = () => { paso = 0; };
  $('#r-reiniciar').onclick = () => { paso = 0; };
  $('#r-copiar').onclick = e => copiar(location.href, e.target, 'Enlace copiado ✓');
  $$('#r-cuerpo a[href^="#ficha-"]').forEach(a => a.onclick = ev => { ev.preventDefault(); $(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); });
}
function copiar(texto, boton, ok) {
  const fin = () => { const t = boton.textContent; boton.textContent = ok; setTimeout(() => boton.textContent = t, 1800); };
  if (navigator.clipboard) navigator.clipboard.writeText(texto).then(fin, () => prompt('Copia el texto:', texto));
  else prompt('Copia el texto:', texto);
}

/* ---------- E-mail y PDF ---------- */
$('#f-legal').innerHTML = `${esc(CONFIG.textoLegal)} <a href="${CONFIG.enlacePrivacidad}" target="_blank">Privacidad</a>.`;
let emailDado = false; // solo durante esta visita: no se guarda
function exportar() { emailDado ? imprimir() : abrirModal(); }
function abrirModal() { $('#modal').classList.remove('oculto'); $('#f-error').textContent = ''; setTimeout(() => $('#f-email').focus(), 50); }
function cerrarModal() { $('#modal').classList.add('oculto'); }
$('#f-cancelar').onclick = cerrarModal;
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') cerrarModal(); });
$('#form-pdf').onsubmit = async e => {
  e.preventDefault();
  const email = $('#f-email').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { $('#f-error').textContent = 'Escribe un e-mail válido.'; return; }
  if (CONFIG.formEndpoint) {
    try {
      await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, empresa: $('#f-empresa').value.trim(), novedades: $('#f-ok').checked, decision: ultimo?.r.decision, papel: ultimo?.r.papel, metodo: ultimo?.rec.principal }) });
    } catch (_) { /* si falla el envío, el usuario descarga igualmente */ }
  }
  emailDado = true;
  cerrarModal();
  imprimir();
};
function imprimir() {
  if (!ultimo) return;
  const { r, rec } = ultimo, P = FICHA[rec.principal], A = FICHA[rec.apoyo];
  const fecha = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#informe').innerHTML = `
    <div class="cab"><img src="assets/logo.png" alt="Anunciantes"><span>🧭 Brújula de la medición · ${fecha}</span></div>
    <h1>Mi mapa de medición</h1>
    <p class="elecciones"><b>Mis respuestas:</b> ${esc(eleccionesTexto(r))}</p>
    <div class="metodos">
      <div class="metodo principal"><span class="etiqueta">Método principal</span><h3>${esc(P.titulo)}</h3>${P.puntos.map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v)}</p>`).join('')}</div>
      <div class="metodo apoyo"><span class="etiqueta">Con el apoyo de</span><h3>${esc(A.titulo)}</h3><p>${esc(rec.apoyoNota)}</p>${A.puntos.slice(1, 3).map(([k, v]) => `<p><b>${esc(k)}:</b> ${esc(v)}</p>`).join('')}</div>
    </div>
    ${rec.avisos.map(a => `<p class="aviso">⚠️ ${esc(a)}</p>`).join('')}
    <div class="bloques">
      <div class="bloque"><h2>Qué responde cada uno</h2>${semaforoHTML([rec.principal, rec.apoyo])}</div>
      <div class="bloque"><h2>Cuidado con…</h2><ul class="errores">${rec.errores.map(e => `<li><b>${esc(ERRORES[e].t)}.</b> ${esc(ERRORES[e].d)}</li>`).join('')}</ul></div>
    </div>
    <h2>Primeros pasos</h2><ol class="pasos">${rec.pasos.map(p => `<li>${esc(PASOS[p])}</li>`).join('')}</ol>
    <h2>Para saber más en la guía</h2><p>${rec.fichas.map(id => `<a href="${esc(urlAbs(guiaUrl(FICHA[id].ancla)))}">${esc(FICHA[id].titulo)}</a>`).join(' · ')}</p><p style="font-size:9pt">Guía completa: <a href="${esc(urlAbs(CONFIG.guia))}">${esc(urlAbs(CONFIG.guia))}</a></p>
    <p style="font-size:9pt;color:#746479;margin-top:14pt">Basado en la Guía práctica de modelos de atribución y medición de la eficacia publicitaria (Asociación Española de Anunciantes). Recomendación orientativa: cada caso necesita criterio experto.</p>`;
  const tituloAntes = document.title;
  document.title = 'Mi mapa de medición - Brújula de la medición'; // nombre propuesto del PDF
  document.body.classList.add('imprimiendo');
  const quitar = () => { document.body.classList.remove('imprimiendo'); document.title = tituloAntes; window.removeEventListener('afterprint', quitar); };
  window.addEventListener('afterprint', quitar);
  setTimeout(() => window.print(), 100);
}

/* ---------- Fichas ---------- */
const TEMAS = ['Todas', ...new Set(FICHAS.map(f => f.tema))];
$('#f-filtros').innerHTML = TEMAS.map((t, i) => `<button class="filtro" data-t="${t}" aria-pressed="${i === 0}">${t}</button>`).join('');
$('#f-lista').innerHTML = FICHAS.map(f => fichaHTML(f).replace('<article class="ficha', `<article data-tema="${f.tema}" class="ficha`)).join('');
glosarCada('#f-lista .ficha');
function glosarCada(sel) { $$(sel).forEach(glosar); }
function filtrarFichas(t) {
  $$('#f-filtros .filtro').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === t));
  $$('#f-lista .ficha').forEach(f => f.classList.toggle('oculto', t !== 'Todas' && f.dataset.tema !== t));
}
$$('#f-filtros .filtro').forEach(b => b.onclick = () => filtrarFichas(b.dataset.t));

/* ---------- Comparador ---------- */
let elegidos = ['mmm', 'dda', 'geo'];
function pintarComparador() {
  $('#c-selector').innerHTML = COMPARADOR.metodos.map(m => `<button class="filtro" data-m="${m.id}" aria-pressed="${elegidos.includes(m.id)}">${esc(m.n)}</button>`).join('');
  $$('#c-selector .filtro').forEach(b => b.onclick = () => {
    const id = b.dataset.m;
    if (elegidos.includes(id)) { if (elegidos.length > 1) elegidos = elegidos.filter(x => x !== id); }
    else { elegidos = [...elegidos, id].slice(-3); }
    pintarComparador();
  });
  const ms = COMPARADOR.metodos.filter(m => elegidos.includes(m.id));
  $('#c-tabla').innerHTML = `<table class="tabla-comp"><thead><tr><th></th>${ms.map(m => `<th>${esc(m.n)}</th>`).join('')}</tr></thead><tbody>` +
    COMPARADOR.atributos.map((a, i) => `<tr><th>${esc(a)}</th>${ms.map(m => `<td>${esc(m.v[i])}</td>`).join('')}</tr>`).join('') +
    `<tr><th>Ficha</th>${ms.map(m => `<td><a class="saber" href="${guiaUrl(FICHA[m.id].ancla)}" target="_blank" rel="noopener">Saber más →</a></td>`).join('')}</tr></tbody></table>`;
  glosar($('#c-tabla'));
}
pintarComparador();
$('#c-nota').textContent = 'Cómo leerla: en los canales digitales basados en clics, la atribución suele dar una visión generosa del efecto (un límite superior) y los experimentos de incrementalidad la más conservadora (un límite inferior). Una buena estimación del MMM debería quedar entre ambas (Google, 2024).';

/* ---------- ¿Mito o realidad? ---------- */
let mi = 0, aciertos = 0, respondida = false;
function pintarMito() {
  const c = $('#m-cuerpo');
  if (mi >= MITOS.length) {
    const txt = aciertos === MITOS.length ? '¡Pleno! Mides con criterio.' : aciertos >= MITOS.length * .7 ? 'Muy bien: tienes claros los conceptos clave.' : 'Hay margen: estos son justo los errores que más se repiten en los comités.';
    c.innerHTML = `<div class="tarjeta-quiz"><p class="antetitulo">Resultado</p><p class="frase">${aciertos} de ${MITOS.length} aciertos</p><p>${txt}</p>
      <div class="botones"><button class="boton principal" id="m-otra">Volver a jugar</button><a class="boton" href="#brujula">Hacer la Brújula</a>
      <a class="boton" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(location.href.split('#')[0] + '#mitos')}">Compartir en LinkedIn</a></div></div>`;
    $('#m-otra').onclick = () => { mi = 0; aciertos = 0; pintarMito(); };
    return;
  }
  const m = MITOS[mi]; respondida = false;
  c.innerHTML = `<div class="tarjeta-quiz"><span class="paso-num">Afirmación ${mi + 1} de ${MITOS.length} · ${aciertos} aciertos</span>
    <div class="progreso"><div style="width:${mi / MITOS.length * 100}%"></div></div>
    <p class="frase">«${esc(m.f)}»</p>
    <div class="botones"><button class="boton" data-v="mito">🙅 Mito</button><button class="boton" data-v="realidad">✅ Realidad</button></div>
    <div id="m-ver"></div></div>`;
  $$('.botones .boton', c).forEach(b => b.onclick = () => {
    if (respondida) return; respondida = true;
    const bien = (b.dataset.v === 'mito') === m.mito; if (bien) aciertos++;
    $$('.botones .boton', c).forEach(x => x.disabled = true);
    $('#m-ver').innerHTML = `<div class="veredicto ${bien ? 'bien' : 'mal'}"><b>${bien ? '¡Correcto!' : 'No…'} Es ${m.mito ? 'un mito' : 'una realidad'}.</b> ${esc(m.e)}
      <a class="saber" href="${guiaUrl(m.ancla)}" target="_blank" rel="noopener">Saber más →</a></div>
      <div class="barra-final"><button class="boton principal" id="m-sig">${mi === MITOS.length - 1 ? 'Ver resultado' : 'Siguiente →'}</button></div>`;
    glosar($('#m-ver'));
    $('#m-sig').onclick = () => { mi++; pintarMito(); };
    $('#m-sig').focus();
  });
}
pintarMito();

/* ---------- Simulador ---------- */
const A_ = Math.log(3000), B_ = 200; // curva ilustrativa: ventas (miles de €) = e^(A − B/x)
const ventas = x => Math.exp(A_ - B_ / x);
const marginal = x => ventas(x) * B_ / (x * x);
let xCorte = 200; { let lo = B_, hi = 5000; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; marginal(mid) > 1 ? lo = mid : hi = mid; } xCorte = (lo + hi) / 2; }
const css = v => getComputedStyle(document.body).getPropertyValue(v).trim();
function prepararLienzo(cv) {
  const dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 760, h = w * 440 / 760;
  cv.width = w * dpr; cv.height = h * dpr; const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.font = '13px Manrope, sans-serif'; return { g, w, h };
}
function dibujarSim() {
  const cv = $('#s-canvas'); if (!cv || !cv.offsetParent) return;
  const x0 = +$('#s-inv').value;
  const { g, w, h } = prepararLienzo(cv);
  const m = { l: 56, r: 16, t: 20, b: 44 }, X = v => m.l + v / 1000 * (w - m.l - m.r), Y = v => h - m.b - v / 3000 * (h - m.t - m.b);
  g.clearRect(0, 0, w, h);
  g.strokeStyle = css('--borde'); g.fillStyle = css('--malva'); g.lineWidth = 1;
  for (let v = 0; v <= 3000; v += 500) { g.beginPath(); g.moveTo(m.l, Y(v)); g.lineTo(w - m.r, Y(v)); g.stroke(); g.fillText(fmt(v), 6, Y(v) + 4); }
  g.textAlign = 'center'; for (let v = 0; v <= 1000; v += 200) g.fillText(fmt(v), Math.min(X(v), w - m.r - 14), h - m.b + 18); g.textAlign = 'left';
  g.fillText('Inversión semanal (miles de €)', w / 2 - 90, h - 6);
  g.save(); g.translate(14, h / 2 + 60); g.rotate(-Math.PI / 2); g.restore();
  // zona en la que el siguiente euro ya no compensa
  g.fillStyle = document.body.classList.contains('oscuro') ? 'rgba(206,0,0,.12)' : 'rgba(206,0,0,.06)';
  g.fillRect(X(xCorte), m.t, X(1000) - X(xCorte), h - m.t - m.b);
  g.setLineDash([5, 5]); g.strokeStyle = css('--rojo'); g.beginPath(); g.moveTo(X(xCorte), m.t); g.lineTo(X(xCorte), h - m.b); g.stroke(); g.setLineDash([]);
  g.fillStyle = css('--rojo'); g.fillText('El siguiente euro', X(xCorte) + 8, m.t + 16); g.fillText('ya no se recupera', X(xCorte) + 8, m.t + 32);
  // curva
  g.strokeStyle = css('--verde-osc'); g.lineWidth = 3; g.beginPath();
  for (let v = 5; v <= 1000; v += 5) { const yy = Y(ventas(v)); v === 5 ? g.moveTo(X(v), yy) : g.lineTo(X(v), yy); } g.stroke();
  // tangente (ROI marginal) y recta desde el origen (ROI medio)
  const y0 = ventas(x0), mg = marginal(x0);
  g.lineWidth = 1.5; g.strokeStyle = css('--malva'); g.setLineDash([3, 4]);
  g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(x0), Y(y0)); g.stroke(); g.setLineDash([]);
  g.strokeStyle = css('--texto'); g.beginPath(); const d = 120; g.moveTo(X(Math.max(0, x0 - d)), Y(y0 - mg * Math.min(d, x0))); g.lineTo(X(Math.min(1000, x0 + d)), Y(y0 + mg * Math.min(d, 1000 - x0))); g.stroke();
  g.fillStyle = css('--negro'); g.strokeStyle = css('--verde'); g.lineWidth = 3;
  g.beginPath(); g.arc(X(x0), Y(y0), 7, 0, 2 * Math.PI); g.fill(); g.stroke();
  g.fillStyle = css('--malva'); g.fillText('Ventas atribuidas (miles de €)', m.l + 6, m.t + 16);
  // datos
  const med = y0 / x0;
  $('#s-k1').textContent = fmt(x0); $('#s-k2').textContent = fmt(y0); $('#s-k3').textContent = fmt(med, 2); $('#s-k4').textContent = fmt(mg, 2);
  const msg = $('#s-msg'); msg.classList.toggle('rojo', mg < 1);
  msg.innerHTML = x0 < B_ ? `<b>Zona de arranque.</b> Cada euro rinde más que el anterior: el siguiente devuelve ${fmt(mg, 2)} €, por encima de la media (${fmt(med, 2)} €).`
    : mg >= 1 ? `<b>Rendimientos decrecientes.</b> El siguiente euro devuelve ${fmt(mg, 2)} €: menos que la media (${fmt(med, 2)} €), pero todavía compensa.`
    : `<b>El siguiente euro ya solo devuelve ${fmt(mg, 2)} €</b> y no recupera lo invertido, aunque el ROI medio (${fmt(med, 2)} €) siga pareciendo bueno. Es el error de tomar el ROI medio por el marginal.`;
}
$('#s-inv').oninput = dibujarSim;
function dibujarAds() {
  const cv = $('#s-canvas2'); if (!cv || !cv.offsetParent) return;
  const lam = +$('#s-dec').value / 100, sem = 14, pres = Array.from({ length: 60 }, (_, i) => i < 4 ? 100 : 0);
  const ef = []; pres.forEach((p, i) => ef.push(p + lam * (i ? ef[i - 1] : 0)));
  const total = ef.reduce((a, b) => a + b, 0), despues = ef.slice(4).reduce((a, b) => a + b, 0);
  const { g, w, h } = prepararLienzo(cv);
  const m = { l: 40, r: 16, t: 30, b: 44 }, maxY = Math.max(...ef) * 1.1, bw = (w - m.l - m.r) / sem;
  const Y = v => h - m.b - v / maxY * (h - m.t - m.b);
  g.clearRect(0, 0, w, h);
  for (let i = 0; i < sem; i++) {
    const x = m.l + i * bw;
    if (pres[i]) { g.fillStyle = css('--borde'); g.fillRect(x + bw * .12, Y(pres[i]), bw * .76, h - m.b - Y(pres[i])); }
    g.fillStyle = i < 4 ? css('--verde-osc') : css('--verde'); g.globalAlpha = i < 4 ? 1 : .75;
    g.fillRect(x + bw * .3, Y(ef[i]), bw * .4, h - m.b - Y(ef[i])); g.globalAlpha = 1;
    g.fillStyle = css('--malva'); g.fillText(`S${i + 1}`, x + bw / 2 - 8, h - m.b + 18);
  }
  g.fillStyle = css('--malva'); g.fillText('Gris: presión de la campaña · Verde: efecto (con adstock)', m.l, 18);
  g.setLineDash([5, 5]); g.strokeStyle = css('--malva'); g.beginPath(); g.moveTo(m.l + 4 * bw, m.t); g.lineTo(m.l + 4 * bw, h - m.b); g.stroke(); g.setLineDash([]);
  g.fillText('Fin de la campaña', m.l + 4 * bw + 6, m.t + 14);
  const pct = total ? despues / total * 100 : 0;
  $('#s-a1').textContent = `${Math.round(lam * 100)} %`; $('#s-a2').textContent = `${fmt(pct)} %`;
  $('#s-amsg').classList.remove('rojo');
  $('#s-amsg').innerHTML = lam === 0 ? '<b>Sin adstock, el efecto acaba con la campaña.</b> Así es como lo ven las métricas inmediatas.'
    : `<b>El ${fmt(pct)} % del efecto llega cuando la campaña ya ha terminado.</b> Por eso recortar no hace caer las ventas de inmediato, y esa aparente inmunidad es engañosa.`;
}
$('#s-dec').oninput = dibujarAds;
$('#s-tab1').onclick = () => { $('#s-sat').classList.remove('oculto'); $('#s-ads').classList.add('oculto'); $('#s-tab1').setAttribute('aria-pressed', true); $('#s-tab2').setAttribute('aria-pressed', false); dibujarSim(); };
$('#s-tab2').onclick = () => { $('#s-ads').classList.remove('oculto'); $('#s-sat').classList.add('oculto'); $('#s-tab2').setAttribute('aria-pressed', true); $('#s-tab1').setAttribute('aria-pressed', false); dibujarAds(); };
window.addEventListener('resize', () => { dibujarSim(); dibujarAds(); });

/* ---------- Evidencias ---------- */
const urlHerramienta = () => location.href.split('#')[0];
$('#e-lista').innerHTML = EVIDENCIAS.map((e, i) => `<div class="evidencia"><b>${esc(e.c)}</b><p>${esc(e.t)}</p><small>${esc(e.f)}</small>
  <div class="acciones-ev"><a class="boton peq" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(urlHerramienta() + '#evidencias')}">Compartir en LinkedIn</a>
  <button class="boton peq" data-i="${i}">Copiar texto</button></div></div>`).join('');
$$('#e-lista button').forEach(b => b.onclick = () => { const e = EVIDENCIAS[b.dataset.i]; copiar(`${e.c}: ${e.t} (${e.f})\n\nMás en la Brújula de la medición: ${urlHerramienta()}`, b, 'Copiado ✓'); });

/* ---------- Glosario ---------- */
$('#g-lista').innerHTML = GLOSARIO.map(g => `<div><b>${esc(g.termino)}.</b> ${esc(g.definicion)} <a href="${guiaUrl(g.id)}" target="_blank" rel="noopener">En la guía →</a></div>`).join('');

/* ---------- Arranque ---------- */
glosar($('#p-intro'));
irA();
})();
