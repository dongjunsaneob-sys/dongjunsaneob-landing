(() => {
  const form = document.querySelector('#estimate-form');
  const dialog = document.querySelector('#success-dialog');
  const closeButton = document.querySelector('#dialog-close');
  const currentParams = new URLSearchParams(window.location.search);

  ['src', 'utm_source', 'utm_medium', 'utm_campaign'].forEach((key) => {
    const input = document.querySelector(`#${key}`);
    if (input) input.value = currentParams.get(key) || '';
  });

  const normalizePhone = (value) => value.replace(/[^0-9]/g, '');
  const phoneInput = form.querySelector('input[name="phone"]');
  phoneInput.addEventListener('input', () => {
    const digits = normalizePhone(phoneInput.value).slice(0, 11);
    if (digits.length <= 3) phoneInput.value = digits;
    else if (digits.length <= 7) phoneInput.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    else phoneInput.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const name = (formData.get('name') || '').trim();
    const phone = normalizePhone(formData.get('phone') || '');

    if (!name) {
      alert('성함 또는 상호를 입력해 주세요.');
      form.querySelector('input[name="name"]').focus();
      return;
    }
    if (phone.length < 9) {
      alert('연락처를 정확히 입력해 주세요.');
      phoneInput.focus();
      return;
    }
    if (!formData.get('agree')) {
      alert('개인정보 수집·이용 동의가 필요합니다.');
      form.querySelector('input[name="agree"]').focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = '접수 중입니다…';

    try {
      // 기존 운영 API와 동일한 FormData 필드명과 파일 전송 형식을 사용합니다.
      const response = await fetch('/api/estimate', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('submission_failed');
      form.reset();
      form.querySelector('input[name="work"][value="철거·원상복구"]').checked = true;
      form.querySelector('input[name="region"][value="대전"]').checked = true;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else alert('신청이 접수됐습니다. 운영시간 내 담당자가 순차 연락드리겠습니다.');
    } catch (error) {
      alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 1533-6968로 연락해 주세요.');
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = '지원 대상 · 실측 가능 여부 확인';
    }
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
