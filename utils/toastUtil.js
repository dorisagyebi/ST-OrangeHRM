export async function waitForToastNotification(page, expectedText, timeout = 5000) {
    return await page.evaluate(
        ({ expectedText, timeout }) => {
            return new Promise((resolve, reject) => {
                const observer = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE && node.textContent?.includes(expectedText)) {
                                observer.disconnect();
                                resolve(node.textContent);
                            }
                        }
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true });

                setTimeout(() => {
                    observer.disconnect();
                    reject(new Error(`Toast notification with text "${expectedText}" not found within ${timeout}ms`));
                }, timeout);
            });
        },
        { expectedText, timeout }
    );
}
