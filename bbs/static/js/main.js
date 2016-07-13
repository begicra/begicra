(() => {
  'use strict';

  const config = {
    get showHint() {
      const value = localStorage.getItem('begicra:show-hint');
      return value ? value !== 'false' : false;
    },
    toggleShowHint() {
      const showHint = !this.showHint;
      localStorage.setItem('begicra:show-hint', showHint);
      return showHint;
    },
  };

  const hintManager = {
    hint(show) {
      if (show) {
        this.showHint();
      } else {
        this.hideHint();
      }
    },
    showHint() {
      $('.bbs-hint').popover('show');
    },
    hideHint() {
      $('.bbs-hint').popover('hide');
    },
  };

  $(() => {
    $('.bbs-hint').popover({
      animattion: true,
      trigger: 'manual',
      html: true,
    });

    hintManager.hint(config.showHint);
  });

  $(document).on('click', '.bbs-show-hint', () => {
    const showHint = config.toggleShowHint();

    $('.bbs-hint').popover(showHint ? 'show' : 'hide');
  });
})();
