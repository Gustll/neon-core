// src/app/game-setup/game-setup.e2e.spec.ts
import { test, expect } from '@playwright/test';

const SETUP_PATH = '/game-setup';

test.describe('GameSetupComponent (button-toggle levels)', () => {
    test('selecting Level 3 navigates to /play?level=3', async ({ page }) => {
        await page.goto(SETUP_PATH);

        // Wait for the toggle group to be present
        const group = page.locator('mat-button-toggle-group[name="level"]');
        await expect(group).toBeVisible();

        await page.getByTestId('level-group').waitFor();
        await page
            .getByTestId('level-3')
            .locator('button, .mat-button-toggle-button, .mdc-button')
            .first()
            .click();
        await page.getByTestId('play-btn').click();

        // Expect /play?level=3
        await expect(page).toHaveURL((url) => {
            const u = new URL(url);
            return (
                u.pathname.endsWith('/play') &&
                u.searchParams.get('level') === '3'
            );
        });
    });
});
