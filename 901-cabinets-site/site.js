// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".mobile-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  // YouTube click-to-load
  // Cards with [data-youtube="VIDEO_ID"] use the YouTube poster as background
  // and replace themselves with an autoplaying iframe on first click.
  document.querySelectorAll(".video-card[data-youtube]").forEach((card) => {
    const id = card.getAttribute("data-youtube");
    if (!id) return;
    const media = card.querySelector(".video-card-media");
    if (!media) return;

    // Use YouTube's hqdefault as poster (works for every video)
    const img = media.querySelector("img");
    if (img && !img.getAttribute("data-keep-poster")) {
      img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      img.alt = card.querySelector("h3")?.textContent || "YouTube video";
    }

    // Hide placeholder note if present
    const note = media.querySelector(".video-placeholder-note");
    if (note) note.style.display = "none";

    // Build the YouTube watch URL (used for both popup fallback and the inline link)
    const watchUrl = `https://www.youtube.com/shorts/${id}`;

    // YouTube embeds refuse to load from file:// origins (the iframe gets a null Origin header).
    // Detect that case and force the new-tab fallback. On any real http(s) origin we use inline embed.
    const isFileProtocol = window.location.protocol === "file:";
    const useInlineEmbed = !isFileProtocol;

    media.style.cursor = "pointer";
    media.addEventListener("click", (e) => {
      e.preventDefault();
      if (useInlineEmbed) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
        iframe.title = card.querySelector("h3")?.textContent || "YouTube video";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;";
        media.innerHTML = "";
        media.appendChild(iframe);
      } else {
        window.open(watchUrl, "_blank", "noopener,noreferrer");
      }
    });

    // Add a small "Watch on YouTube" link in the card body as a clear fallback
    const body = card.querySelector(".video-card-body");
    if (body && !body.querySelector(".video-yt-link")) {
      const link = document.createElement("a");
      link.href = watchUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "video-yt-link";
      link.textContent = "Watch on YouTube ↗";
      body.appendChild(link);
    }
  });
});
