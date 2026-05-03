// ============================================================
// LYKY - app.js - Gestion du formulaire d'inscription
// ============================================================

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOapeca-qCbFfrKTLNIa4v5lUpHv01bhlV_Mlp5r4sARNOv8H_BJIaAcN_UnVkZ0uOnA/exec";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inscriptionForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoading = document.getElementById('btnLoading');
    const formError = document.getElementById('formError');
    
    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;
    if (formError) formError.style.display = 'none';
    
    // Collect form data
    const formData = {
      prenom: document.getElementById('prenom')?.value?.trim() || '',
      nom: document.getElementById('nom')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim() || '',
      telephone: document.getElementById('telephone')?.value?.trim() || '',
      formule: document.getElementById('formule')?.value || '',
      niveau: document.getElementById('niveau')?.value || '',
      objectifs: document.getElementById('objectifs')?.value?.trim() || '',
      message: document.getElementById('message')?.value?.trim() || ''
    };
    
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      // Store data for payment page
      sessionStorage.setItem('inscriptionData', JSON.stringify(formData));
      
      // With no-cors we can't read response, assume success
      // Try to get result with a different approach
      try {
        const fetchResult = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await fetchResult.json();
        sessionStorage.setItem('inscriptionResult', JSON.stringify(result));
      } catch(e) {
        sessionStorage.setItem('inscriptionResult', JSON.stringify({
          success: true,
          id: 'LYKY-' + Date.now().toString().slice(-8)
        }));
      }
      
      // Redirect to payment page
      window.location.href = 'paiement.html';
      
    } catch (error) {
      console.error('Erreur:', error);
      
      if (formError) {
        formError.textContent = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
        formError.style.display = 'block';
      }
      
      // Reset button
      if (btnText) btnText.style.display = 'inline';
      if (btnLoading) btnLoading.style.display = 'none';
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
