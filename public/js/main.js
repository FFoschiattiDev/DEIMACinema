// public/js/main.js - Client-side JavaScript

document.addEventListener('DOMContentLoaded', function () {

  // Delete confirmation
  const deleteForms = document.querySelectorAll('.delete-form');

  deleteForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const confirmed = confirm('¿Estás seguro de que quieres eliminar este elemento?');
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });

});
