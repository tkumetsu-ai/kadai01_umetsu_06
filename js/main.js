// course、newsのスライドイン
$(window).on('scroll', function () {
  $('.fade-in').each(function () {
    if ($(window).scrollTop() + $(window).height() > $(this).offset().top + 100) {
      $(this).addClass('is-show');
    }
  });
}).trigger('scroll');   // ← 読み込み時にも1回実行する

// aboutの画像スライドショー
$(function () {
  const $slides = $('.about-slider img');
  const total = $slides.length;
  const $pauseBtn = $('.slider-pause');
  let current = 0;
  let timer;
  // 「動きを減らす」設定の人には、最初から止めた状態で表示する
  let isPaused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function update() {
    const prev = (current - 1 + total) % total;
    const next = (current + 1) % total;

    $slides.removeClass('is-active is-prev is-next');
    $slides.eq(current).addClass('is-active');
    $slides.eq(prev).addClass('is-prev');
    $slides.eq(next).addClass('is-next');
  }

  // 自動再生を（やり直して）始める
  function startTimer() {
    clearInterval(timer);   // 前のタイマーを止める
    timer = setInterval(function () {
      current = (current + 1) % total;
      update();
    }, 7000);
  }

  // 停止・再生ボタンの見た目と読み上げ用ラベルを、今の状態に合わせる
  function updatePauseBtn() {
    if (isPaused) {
      $pauseBtn.text('▶').attr('aria-label', 'スライドショーを再生');
    } else {
      $pauseBtn.text('❚❚').attr('aria-label', 'スライドショーを停止');
    }
  }

  // 次へボタン
  $('.slider-next').on('click', function () {
    current = (current + 1) % total;
    update();
    if (!isPaused) startTimer();   // 停止中は自動再生を再開しない
  });

  // 前へボタン
  $('.slider-prev').on('click', function () {
    current = (current - 1 + total) % total;
    update();
    if (!isPaused) startTimer();
  });

  // 停止・再生ボタン
  $pauseBtn.on('click', function () {
    isPaused = !isPaused;   // 停止中 ⇔ 再生中 を切り替える
    if (isPaused) {
      clearInterval(timer);
    } else {
      startTimer();
    }
    updatePauseBtn();
  });

  update();
  updatePauseBtn();
  if (!isPaused) startTimer();
});

// 説明会申し込みボタンの表示
$(window).on('scroll', function () {
  const screenBottom = $(window).scrollTop() + $(window).height(); // 画面の下端の位置
  const courseTop = $('#course').offset().top;
  const contactTop = $('#contact').offset().top;

  if (screenBottom > courseTop  && screenBottom < contactTop) {
    $('.cta-btn').addClass('is-show');
  } else {
    $('.cta-btn').removeClass('is-show');
  }
}).trigger('scroll');

// ハンバーガーメニュー
$(function () {
  const $hamburger = $('.hamburger');
  const $nav = $('.header-nav');

  // ボタンを押したら開く・閉じる
  $hamburger.on('click', function () {
    $hamburger.toggleClass('is-open');
    $nav.toggleClass('is-open');

    const isOpen = $hamburger.hasClass('is-open');
    $hamburger.attr('aria-expanded', isOpen);
    $hamburger.attr('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  // メニューのリンクを押したら閉じる
  $('.header-nav a').on('click', function () {
    $hamburger.removeClass('is-open').attr('aria-expanded', false).attr('aria-label', 'メニューを開く');
    $nav.removeClass('is-open');
  });
});

// お問い合わせ区分：「説明会お申し込み」のときだけ候補日時を表示
$(function () {
  const $seminarRows = $('.seminar-row');
  const $seminarDates = $('input[name="seminar_date"]');

  $('input[name="inquiry_type"]').on('change', function () {
    if ($(this).val() === 'seminar') {
      $seminarRows.prop('hidden', false);
      $seminarDates.prop('required', true);    // 日時の選択を必須にする
    } else {
      $seminarRows.prop('hidden', true);
      $seminarDates.prop('required', false);   // 隠れている項目は必須にしない
      $seminarDates.prop('checked', false);    // 選んでいた日時をリセット
    }
  });
});