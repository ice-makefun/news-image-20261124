# Tuesday 24 November 2026 Front Page

[![news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/ice-makefun/news-image-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/ice-makefun/news-image-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124)

One image that sums up the world's news of Tuesday 24 November 2026,
drawn as a newspaper front page. Run the program and it copies the
finished image to the output directory; run it twice and both runs
write the same bytes.

## The day's stories

1. **Tech** — A US jury in Brooklyn convicts Huawei of conspiring to steal
   trade secrets, bank fraud and breaking Iran sanctions after a two-month
   trial; guilty on 10 of 12 counts, acquitted of racketeering. Sentencing
   is set for 14 September 2027.
2. **Hormuz** — Iran says four tankers struck naval mines in the Strait of
   Hormuz and caught fire, and a container ship hit a mine on an
   "unauthorised" route. Independent monitors say the claims are
   unconfirmed.
3. **Ukraine** — Zelensky confirms Ukraine hit the Russian cargo ship
   Sparta II with a drone in the Gulf of Finland. Tripoli demands answers
   over the Libya strikes; Norway urges caution.
4. **China** — Beijing puts Shanghai party chief Chen Jining, a Politburo
   member once seen as a future leader, under a graft investigation — the
   fourth Politburo member to fall since 2025.
5. **Sport** — The Court of Arbitration for Sport reinstates Senegal as
   Africa Cup champions, restoring the 1-0 extra-time win over Morocco in
   January. Morocco vows to appeal.

Around the world: Nvidia's bounce fades (shares -6%, Nasdaq -1.5%) as
tariff fears return; gunmen hold 25 hostage at a Cartagena supermarket;
Malaysia will send thousands of migrants back to Myanmar; Prabowo names
two candidates to replace vice-president Gibran; a suspected Houthi drone
hits the PIF tower in Riyadh's financial district, wounding 11; China
names Pakistani pilot Zeeshan Ali as the first foreign astronaut to visit
Tiangong.

## How it is made

`frontpage.png` (1024×1024, under 1 MiB) is drawn by `work/compose.py`
with PIL and the system DejaVu fonts — every pixel is drawn
programmatically, no photograph or downloaded image. `main.ts`
(Node 22) copies that file to `$MAKEFUN_OUTPUT_DIR/entry.png` after
verifying its PNG signature, dimensions and IEND trailer.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
