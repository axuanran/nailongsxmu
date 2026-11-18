/* ==========================================================================
   山医奶站 · app.js
   --------------------------------------------------------------------------
   只改下面 CONFIG 这一段就能把站配好，不需要动别的地方。
   ========================================================================== */

(function () {
  'use strict';

  var CONFIG = {
    // 山医奶群号。点「加入奶群」会复制群号。
    groupNumber: '1125198405',

    // QQ 群分享链接：填了之后「加入奶群」直接拉起加群页，不再复制群号。
    groupLink: 'https://qm.qq.com/q/k7RA7bpeTe'
  };

  var MILK_KEY = 'sxmu-milk-v1';
  var MILK_ROUNDS_KEY = 'sxmu-milk-rounds-v1';

  var $ = function (id) {
    return document.getElementById(id);
  };

  /* ---------------- 小工具 ---------------- */

  var toastTimer = 0;

  function toast(message) {
    var el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove('show');
    }, 2600);
  }

  function readNumber(key) {
    try {
      var value = parseInt(window.localStorage.getItem(key) || '0', 10);
      return Number.isFinite(value) && value > 0 ? value : 0;
    } catch (error) {
      return 0;
    }
  }

  function writeNumber(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch (error) {
      /* 隐身模式或禁用存储时静默降级 */
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '-1000px';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (error) {
        ok = false;
      }
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  /* ---------------- 加入奶群 ---------------- */

  function setupJoinButton() {
    var button = $('join-group');
    if (!button) return;

    button.addEventListener('click', function () {
      if (CONFIG.groupLink) {
        var opened = window.open(CONFIG.groupLink, '_blank', 'noopener');
        if (!opened) {
          toast('弹窗被拦了，手动搜群号 ' + CONFIG.groupNumber);
        }
        return;
      }

      if (!CONFIG.groupNumber) {
        toast('群号还没填：先去奶群问站长，或从 NaiList 看看别的学校');
        return;
      }

      // 先给反馈，再尝试复制：某些浏览器（含无权限的 file:// 环境）剪贴板 Promise 可能一直不返回
      toast('群号 ' + CONFIG.groupNumber + ' · 已复制，去 QQ 粘贴加群');
      try {
        copyText(CONFIG.groupNumber).catch(function () {
          toast('群号 ' + CONFIG.groupNumber + ' · 复制失败，手动记一下');
        });
      } catch (error) {
        toast('群号 ' + CONFIG.groupNumber + ' · 手动记一下');
      }
    });
  }

  /* ---------------- 奶力交卷 ---------------- */

  var FLAVOR = [
    { max: 5, text: '手有点抖，奶洒了。' },
    { max: 11, text: '正常发挥，早八水平。' },
    { max: 16, text: '不错，这一局对得起学费。' },
    { max: 20, text: '满奶！建议直接去官网看录取通知。' }
  ];

  function flavorFor(score) {
    for (var i = 0; i < FLAVOR.length; i += 1) {
      if (score <= FLAVOR[i].max) return FLAVOR[i].text;
    }
    return '交卷成功。';
  }

  function renderMilk(score, total) {
    var totalEl = $('milk-total');
    var localEl = $('milk-local');
    var outEl = $('milk-result');

    if (totalEl) totalEl.textContent = String(total);
    if (localEl) localEl.textContent = String(total);
    if (outEl) {
      outEl.textContent =
        '本局 +' + score + ' 分 · 累计 ' + total + ' 分。' + flavorFor(score);
    }
  }

  function setupMilk() {
    var button = $('submit-milk');
    if (!button) return;

    var total = readNumber(MILK_KEY);
    var rounds = readNumber(MILK_ROUNDS_KEY);

    var totalEl = $('milk-total');
    var localEl = $('milk-local');
    if (totalEl) totalEl.textContent = String(total);
    if (localEl) localEl.textContent = String(total);

    button.addEventListener('click', function () {
      var score = 1 + Math.floor(Math.random() * 20);
      total += score;
      rounds += 1;

      writeNumber(MILK_KEY, total);
      writeNumber(MILK_ROUNDS_KEY, rounds);

      button.textContent = '再交一局';
      renderMilk(score, total);
    });
  }

  /* ---------------- 盖章彩蛋 ---------------- */

  function setupSeal() {
    var seal = $('seal');
    if (!seal) return;

    var marks = ['奶', '🥛', '奶', '🐉', '奶', '🥛'];

    seal.addEventListener('click', function () {
      var classes = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'];

      for (var i = 0; i < classes.length; i += 1) {
        var drop = document.createElement('span');
        drop.className = 'burst ' + classes[i];
        drop.setAttribute('aria-hidden', 'true');
        drop.textContent = marks[i];
        seal.appendChild(drop);

        (function (node) {
          window.setTimeout(function () {
            if (node.parentNode) node.parentNode.removeChild(node);
          }, 950);
        })(drop);
      }
    });
  }

  /* ---------------- 页脚年份 ---------------- */

  function setupYear() {
    var el = $('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------- 启动 ---------------- */

  setupJoinButton();
  setupMilk();
  setupSeal();
  setupYear();
})();
