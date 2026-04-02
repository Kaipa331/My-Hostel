export function WhatsAppButton() {
  const phone = '265991695597';
  const message = encodeURIComponent('Hello! I found you on MyHostel.com and I have a question.');
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      id="whatsapp-float-btn"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      style={{ backgroundColor: '#25D366' }}
    >
      {/* WhatsApp SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-white"
        aria-hidden="true"
      >
        <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.853 6.64L2.667 29.333l6.88-1.813A13.28 13.28 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.003 2.667zm0 24c-2.12 0-4.2-.573-6-1.653l-.427-.253-4.08 1.08 1.093-4-.28-.44A10.64 10.64 0 0 1 5.333 16c0-5.88 4.787-10.667 10.67-10.667 5.88 0 10.667 4.787 10.667 10.667 0 5.88-4.787 10.667-10.667 10.667zm5.84-7.973c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-.986 1.253-.16.213-.32.24-.64.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.387.48-.573.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.52-.533-.72-.533h-.613c-.213 0-.56.08-.853.4S9.76 11.68 9.76 12.907c0 1.227.893 2.413 1.013 2.573.12.16 1.76 2.773 4.267 3.773.6.267 1.067.427 1.427.547.6.187 1.147.16 1.573.093.48-.067 1.467-.6 1.68-1.187.213-.587.213-1.093.147-1.187-.067-.093-.267-.16-.587-.32z"/>
      </svg>

      {/* Tooltip */}
      <span className="absolute right-16 bottom-1/2 translate-y-1/2 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
