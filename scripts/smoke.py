"""
Smoke test do NoNotion-Next.

Sobe o app com `pnpm start` (ou `next start -p 3101`) e roda:
  python3 scripts/smoke.py

Verifica: strings PT-BR, CRUD, diálogo de excluir, drag no kanban,
ausência de erros JS. Requer playwright instalado:
  pip install playwright && playwright install chromium
"""
import asyncio
import sys
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:3101/"
FAILURES: list[str] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    print(("PASS " if ok else "FAIL ") + name + (f" ({detail})" if detail else ""))
    if not ok:
        FAILURES.append(name)


async def main() -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1400, "height": 900})
        errors: list[str] = []
        page.on("pageerror", lambda e: errors.append(str(e)[:150]))
        await page.goto(BASE, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(1500)

        # 1. PT-BR na UI
        en_labels = await page.evaluate("""() =>
            [...document.querySelectorAll('button[aria-label]')]
                .map(b => b.getAttribute('aria-label'))
                .filter(l => /Filter|Sort|Settings|Delete|Cancel|Search|Group|Open in|calculation|Add row|Row actions/.test(l))""")
        check("sem inglês nos aria-labels", len(en_labels) == 0, ",".join(en_labels))
        body = await page.evaluate("() => document.body.innerText")
        leftovers = [w for w in ["New page", "Delete", "Cancel "] if w in body]
        check("sem inglês no texto visível", not leftovers, ",".join(leftovers))

        # 2. CRUD
        rows = page.locator('[data-notion-slot="notion-table-view"] [role="row"]')
        n0 = await rows.count()
        await page.get_by_role("button", name="Nova página").first.click()
        await page.wait_for_timeout(1000)
        check("criar tarefa", await rows.count() == n0 + 1, f"{n0}->{await rows.count()}")

        await rows.first.locator('[role="checkbox"]').click()
        await page.wait_for_timeout(600)
        check("toolbar 'Excluir 1 linha'",
              await page.get_by_role("button", name="Excluir 1 linha").count() == 1)
        await page.get_by_role("button", name="Excluir 1 linha").click()
        await page.wait_for_timeout(700)
        check("diálogo 'Excluir 1 linha?'",
              await page.get_by_text("Excluir 1 linha?").count() == 1)
        await page.get_by_role("button", name="Excluir", exact=True).click()
        await page.wait_for_timeout(1000)
        check("excluir tarefa", await rows.count() == n0, f"voltou a {n0}")

        # 3. drag no kanban
        await page.get_by_role("tab", name="Kanban").click()
        await page.wait_for_timeout(1200)
        card = page.get_by_text("Corrigir lentidão nas consultas").first
        box = await card.bounding_box()
        await page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
        await page.mouse.down()
        await page.mouse.move(box["x"] + 450, box["y"] + 30, steps=12)
        await page.mouse.up()
        await page.wait_for_timeout(1200)
        st = await page.evaluate("""() => {
            const rows = JSON.parse(localStorage.getItem('nonotion-tarefas-v1') || '[]');
            const r = rows.find(r => (r.properties.title.value || '').includes('lentidão'));
            return r ? r.properties.status.value : '?';
        }""")
        check("drag muda o status", st == "Backlog", st)

        check("sem erros JS", not errors, ";".join(errors))
        await browser.close()

    if FAILURES:
        print(f"\n{len(FAILURES)} FALHA(S): {FAILURES}")
        sys.exit(1)
    print("\nTudo certo.")


asyncio.run(main())
