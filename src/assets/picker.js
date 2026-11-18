/* Designs picker: the "Designs" chip opens the dialog of six designs (review C3).
   First-party, no dependencies. Without this script, or without <dialog>, the chip
   stays a plain link to /d/. AgentiCCells, code Apache-2.0. */
(function () {
  var d = document.getElementById('designs');
  if (!d || typeof d.showModal !== 'function') return;
  var opener = null, close = d.querySelector('.dz-close');
  var chips = document.querySelectorAll('a[data-designs]');
  // Round 5 (review item 10): load all six thumbnails at once, as soon as the reader
  // shows intent (pointer or focus on the chip), and in any case before the dialog opens.
  var warm = function () {
    var imgs = d.querySelectorAll('img[loading="lazy"]');
    for (var k = 0; k < imgs.length; k++) imgs[k].loading = 'eager';
  };
  for (var i = 0; i < chips.length; i++) {
    chips[i].setAttribute('aria-haspopup', 'dialog');
    chips[i].setAttribute('aria-controls', 'designs');
    chips[i].addEventListener('pointerenter', warm);
    chips[i].addEventListener('focus', warm);
    chips[i].addEventListener('touchstart', warm, { passive: true });
    chips[i].addEventListener('click', function (e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      opener = this;
      warm();
      d.showModal();
      if (close) close.focus();
    });
  }
  if (close) close.addEventListener('click', function () { d.close(); });
  d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = d.querySelectorAll('a[href], button');
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  d.addEventListener('close', function () { if (opener) { opener.focus(); opener = null; } });
})();
