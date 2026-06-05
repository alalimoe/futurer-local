(function () {
  var ENDPOINT = 'https://a.klaviyo.com/client/subscriptions';
  var REVISION = '2026-01-15';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function init(root) {
    if (root.__npNlBound) return;
    root.__npNlBound = true;

    var form = root.querySelector('[data-np-form]');
    if (!form) return;

    var input = form.querySelector('input[type="email"]');
    var btn = form.querySelector('[data-np-submit]');
    var status = form.querySelector('[data-np-status]');
    var success = root.querySelector('[data-np-success]');
    var publicKey = root.getAttribute('data-public-key');
    var listId = root.getAttribute('data-list-id');
    var source = root.getAttribute('data-source') || 'Website signup form';

    function setStatus(message, state) {
      if (!status) return;
      status.textContent = message || '';
      if (state) {
        status.setAttribute('data-state', state);
      } else {
        status.removeAttribute('data-state');
      }
    }

    function setLoading(isLoading) {
      if (!btn) return;
      if (isLoading) {
        btn.setAttribute('aria-busy', 'true');
        btn.disabled = true;
      } else {
        btn.removeAttribute('aria-busy');
        btn.disabled = false;
      }
    }

    function showSuccess(email) {
      try {
        if (window.klaviyo && typeof window.klaviyo.push === 'function') {
          window.klaviyo.push(['identify', { '$email': email }]);
        }
      } catch (e) {}

      if (success) {
        form.setAttribute('hidden', '');
        success.removeAttribute('hidden');
        try { success.focus(); } catch (e) {}
      } else {
        setStatus('Thanks! Check your inbox to confirm.', 'success');
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var email = (input && input.value ? input.value : '').trim();

      if (!EMAIL_RE.test(email)) {
        if (input) {
          input.setAttribute('aria-invalid', 'true');
          input.focus();
        }
        setStatus('Please enter a valid email address.', 'error');
        return;
      }
      if (input) input.removeAttribute('aria-invalid');

      if (!publicKey || !listId) {
        setStatus('Sign-up is temporarily unavailable. Please try again later.', 'error');
        return;
      }

      setStatus('', null);
      setLoading(true);

      var payload = {
        data: {
          type: 'subscription',
          attributes: {
            custom_source: source,
            profile: {
              data: {
                type: 'profile',
                attributes: { email: email }
              }
            }
          },
          relationships: {
            list: { data: { type: 'list', id: listId } }
          }
        }
      };

      fetch(ENDPOINT + '?company_id=' + encodeURIComponent(publicKey), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json',
          'revision': REVISION
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (res.ok || res.status === 202 || res.status === 204) {
            showSuccess(email);
            return;
          }
          throw new Error('Subscription failed with status ' + res.status);
        })
        .catch(function () {
          setLoading(false);
          setStatus('Something went wrong. Please try again in a moment.', 'error');
        });
    });

    if (input) {
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') {
          input.removeAttribute('aria-invalid');
          setStatus('', null);
        }
      });
    }
  }

  function boot() {
    var roots = document.querySelectorAll('[data-np-newsletter]');
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('shopify:section:load', boot);
})();
