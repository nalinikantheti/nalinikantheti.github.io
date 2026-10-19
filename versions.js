// Keep the same collection or artwork open when comparing the two designs.
function syncDesignLinks(){document.querySelectorAll('[data-version]').forEach(link=>{const url=new URL(link.href);url.hash=location.hash||'#home';link.href=url.href;});}
syncDesignLinks();addEventListener('hashchange',syncDesignLinks);
document.querySelector('.design-versions')?.addEventListener('pointerover',syncDesignLinks);
document.querySelector('.design-versions')?.addEventListener('focusin',syncDesignLinks);
document.querySelector('.design-versions')?.addEventListener('click',syncDesignLinks,true);
