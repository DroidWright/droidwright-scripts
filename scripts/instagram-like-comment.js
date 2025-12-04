// ==DroidScript==
// @id              instagram-like-comment
// @name            Instagram Like & Comment
// @icon            https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @description     Likes posts and adds comments on Instagram feed with scroll retry logic.
// @author          tas33n
// @version         1.0.0
// @targetApp       com.instagram.android
// @url             https://github.com/tas33n/droidwright
// @created         2024-11-08
// ==/DroidScript==

/**
 * Main automation function
 * @param {Object} ctx - Context object containing device, ui, and app controllers
 * @param {Object} ctx.device - Device control methods (sleep, press, getScreenSize, showToast)
 * @param {Object} ctx.ui - UI interaction methods (find, tap, setText, swipe, exists)
 * @param {Object} ctx.app - App control methods (launch, stop, isRunning)
 * @returns {Object} Result object with status and note
 */
function droidRun(ctx) {
  // Configuration
  const TOTAL_POSTS = 20;
  const MAX_RETRIES = 3;
  const COMMENTS = ["Nice!", "Great post!", "Love it!", "Amazing!", "Awesome!"];
  const settleMs = 1200;
  const swipeDurationMs = 500;
  const targetPackage = "com.instagram.android";

  // Launch Instagram
  ctx.app.launch(targetPackage);
  ctx.device.sleep(settleMs);

  // Get screen dimensions for swipe calculations
  const screen = ctx.device.getScreenSize();
  const swipe = {
    startX: Math.round(screen.width * 0.5),
    startY: Math.round(screen.height * 0.82),
    endX: Math.round(screen.width * 0.5),
    endY: Math.round(screen.height * 0.28),
    duration: swipeDurationMs,
  };

  // UI Element Selectors
  const likeSelector = { id: "com.instagram.android:id/row_feed_button_like" };
  const commentBtnSelector = { id: "com.instagram.android:id/row_feed_button_comment" };
  const commentTextSelector = { id: "com.instagram.android:id/layout_comment_thread_edittext" };
  const postBtnSelector = { id: "com.instagram.android:id/layout_comment_thread_post_button_icon" };

  // Counters
  let likedCount = 0;
  let commentedCount = 0;

  // Process posts
  for (let i = 0; i < TOTAL_POSTS; i++) {
    const label = `${i + 1}/${TOTAL_POSTS}`;
    let retries = 0;
    let liked = false;
    let commented = false;

    while (retries < MAX_RETRIES && (!liked || !commented)) {
      // Try to like the post
      if (!liked) {
        const likeButton = ctx.ui.find(likeSelector);

        if (likeButton) {
          const desc = likeButton.desc || "";
          const isAlreadyLiked = desc.toLowerCase().includes("liked");

          if (!isAlreadyLiked && ctx.ui.tap(likeSelector)) {
            liked = true;
            likedCount++;
            ctx.device.sleep(500);
          } else if (isAlreadyLiked) {
            liked = true;
            ctx.device.sleep(200);
          }
        }
      }

      // Try to comment on the post
      if (!commented && ctx.ui.exists(commentBtnSelector)) {
        if (ctx.ui.tap(commentBtnSelector)) {
          ctx.device.sleep(settleMs);

          if (ctx.ui.exists(commentTextSelector)) {
            const comment = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
            ctx.ui.setText(commentTextSelector, comment);
            ctx.device.sleep(500);

            if (ctx.ui.exists(postBtnSelector)) {
              if (ctx.ui.tap(postBtnSelector)) {
                commented = true;
                commentedCount++;
                ctx.device.sleep(settleMs);
                ctx.device.press("BACK");
                ctx.device.press("BACK");
                ctx.device.sleep(500);
              }
            }
          }
        }
      }

      // Retry logic
      if ((!liked || !commented) && retries < MAX_RETRIES - 1) {
        retries++;
        ctx.ui.swipe(swipe.startX, swipe.startY, swipe.endX, swipe.endY, swipe.duration);
        ctx.device.sleep(settleMs);
      } else {
        break;
      }
    }

    // Show progress
    ctx.device.showToast(`${label}: ${liked ? "Liked" : "Skip"} ${commented ? "+ Comment" : ""}`);

    // Scroll to next post
    if (i < TOTAL_POSTS - 1) {
      ctx.ui.swipe(swipe.startX, swipe.startY, swipe.endX, swipe.endY, swipe.duration);
      ctx.device.sleep(settleMs);
    }
  }

  // Return results
  return {
    status: "ok",
    note: `Liked ${likedCount}, Commented ${commentedCount} of ${TOTAL_POSTS} posts`,
  };
}
