// assets/main.js

// Função genérica para carregar JSON de códigos para uma página
async function loadCodes(slug) {
  const elList = document.getElementById('codesList');
  const titleEl = document.getElementById('pageTitle');
  const leadEl = document.getElementById('pageLead');

  try {
    const res = await fetch(`/data/${slug}.json`, {cache: "no-store"});
    if (!res.ok) throw new Error('Não encontrou dados');
    const data = await res.json();

    // Título e lead dinâmicos (se houver)
    if (data.title) titleEl && (titleEl.textContent = data.title);
    if (data.description) leadEl && (leadEl.textContent = data.description);

    // Renderiza lista
    elList.innerHTML = '';
    const codes = data.codes || [];
    if (codes.length === 0) {
      elList.innerHTML = '<li class="muted">Nenhum código ativo no momento.</li>';
      return;
    }

    for (const item of codes) {
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.setAttribute('role','button');
      const dot = document.createElement('span'); dot.className = 'dot'; dot.setAttribute('aria-hidden','true');
      const code = document.createElement('strong'); code.className = 'code'; code.textContent = item.code;
      const desc = document.createElement('span'); desc.className = 'code-desc'; desc.textContent = (item.desc || '');
      li.appendChild(dot); li.appendChild(code); li.appendChild(desc);

      // copiar no clique
      li.addEventListener('click', ()=> copyAndToast(item.code));
      li.addEventListener('keypress', (e)=>{ if(e.key === 'Enter') copyAndToast(item.code) });

      elList.appendChild(li);
    }
  } catch (err) {
    console.error(err);
    if (elList) elList.innerHTML = '<li class="muted">Erro ao carregar códigos.</li>';
  }
}

function copyAndToast(text) {
  if (!text) return;
  navigator.clipboard?.writeText(text).then(()=> {
    alert('Código copiado: ' + text);
  }).catch(()=> {
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); alert('Código copiado: ' + text); } catch(e){ alert('Não foi possível copiar.'); }
    ta.remove();
  });
}

// Busca global (no topo)
document.getElementById && (() => {
  const searchInput = document.querySelector('.search input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e)=>{
      if (e.key === 'Enter') {
        const q = e.target.value.trim().toLowerCase();
        if (!q) return;
        // redireciona pra página de busca simples (pode criar search.html) - por enquanto filtra localmente:
        alert('Pesquisa local: ' + q + '\\nEm uma versão futura isso pode pesquisar em todas as páginas.');
      }
    });
  }
})();
