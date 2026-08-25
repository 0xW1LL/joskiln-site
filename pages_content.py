# Page body content (inside <main>) for the generator.

POT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><path d="M7 9h10c1.2 0 2 .8 2 1.8 0 .9-.7 1.7-1.7 1.8C17 16.5 14.8 19 12 19s-5-2.5-5.3-6.4C5.7 12.5 5 11.7 5 10.8 5 9.8 5.8 9 7 9z"/><path d="M9 9c0-1.6 1.2-2.5 3-2.5s3 .9 3 2.5"/></svg>'
MUGS_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><path d="M4 10h6v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/><path d="M14 10h6v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/><path d="M10 12h1.5M20 12h1.5"/></svg>'
GIFT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 13h16M12 9v11M12 9c-1.5 0-4-.6-4-2.7C8 4.6 9.4 4 10.3 4 12 4 12 6.6 12 9zm0 0c1.5 0 4-.6 4-2.7C16 4.6 14.6 4 13.7 4 12 4 12 6.6 12 9z"/></svg>'

WHATS_ON = '''
    <section class="page-head">
      <div class="wrap">
        <h1>What's on at the kiln</h1>
        <p class="lead">Every class starts the same way. An apron, a wedge of clay, and no idea what you're capable of yet. Pick a day that suits and I'll save you a seat. Prices include your clay, your firing and a cup of something warm.</p>
      </div>
    </section>

    <section class="section" style="padding-top:20px">
      <div class="wrap">
        <div class="chips" role="group" aria-label="Filter classes">
          <button class="chip" data-filter="all" aria-pressed="true">All</button>
          <button class="chip" data-filter="weekly" aria-pressed="false">Weekly classes</button>
          <button class="chip" data-filter="oneoff" aria-pressed="false">One-off workshops</button>
          <button class="chip" data-filter="kids" aria-pressed="false">Kids &amp; families</button>
          <button class="chip" data-filter="seasonal" aria-pressed="false">Seasonal</button>
        </div>

        <!-- These cards are the season's HIGHLIGHTS — edit each term.        -->
        <!-- Live availability and checkout come from the Baluu embed below. -->
        <div class="grid grid--3">
          <article class="card" data-cat="weekly">
            <div class="wcard__media"><img src="assets/img/adults-workshop.jpg" alt="Evening class working around the big table" loading="lazy"></div>
            <div class="wcard__body">
              <span class="badge badge--nf">◐ Nearly full · 2 places left</span>
              <h3>Wednesday evening wheel class</h3>
              <p class="wcard__when">Autumn term from Wed 16 Sept · 7 to 9pm · six weeks</p>
              <div class="wcard__foot"><span class="wcard__price">£150 per term</span><a class="btn btn--primary" data-book href="#book">Book</a></div>
            </div>
          </article>
          <article class="card" data-cat="weekly">
            <div class="wcard__media"><img src="assets/img/clay-houses.jpg" alt="Hand-built clay houses drying on the bench" loading="lazy"></div>
            <div class="wcard__body">
              <span class="badge badge--ok">● Available</span>
              <h3>Thursday morning hand-building</h3>
              <p class="wcard__when">Autumn term from Thu 17 Sept · 10am to 12pm · six weeks</p>
              <div class="wcard__foot"><span class="wcard__price">£120 per term</span><a class="btn btn--primary" data-book href="#book">Book</a></div>
            </div>
          </article>
          <article class="card" data-cat="oneoff">
            <div class="wcard__media"><img src="assets/img/wheel-throwing.jpg" alt="Hands shaping a pot on the wheel" loading="lazy"></div>
            <div class="wcard__body">
              <span class="badge badge--ok">● Available</span>
              <h3>Saturday morning taster</h3>
              <p class="wcard__when">Sat 3 Oct, 10am to 12:30pm · one-off</p>
              <div class="wcard__foot"><span class="wcard__price">£48</span><a class="btn btn--primary" data-book href="#book">Book</a></div>
            </div>
          </article>
          <article class="card" data-cat="oneoff">
            <div class="wcard__media wcard__media--icon">''' + MUGS_ICON + '''</div>
            <div class="wcard__body">
              <span class="badge badge--nf">◐ Nearly full · 1 pair left</span>
              <h3>Date night: pots for two</h3>
              <p class="wcard__when">Fri 9 Oct, 7 to 9:30pm · one-off</p>
              <div class="wcard__foot"><span class="wcard__price">£70 per pair</span><a class="btn btn--primary" data-book href="#book">Book</a></div>
            </div>
          </article>
          <article class="card" data-cat="kids seasonal">
            <div class="wcard__media"><img src="assets/img/kids-workshop.jpg" alt="Children painting clay snowmen" loading="lazy"></div>
            <div class="wcard__body">
              <span class="badge badge--ok">● Available</span>
              <h3>Half-term little makers</h3>
              <p class="wcard__when">Wed 28 Oct, 2 to 4pm · kids &amp; families</p>
              <div class="wcard__foot"><span class="wcard__price">£30 per maker</span><a class="btn btn--primary" data-book href="#book">Book</a></div>
            </div>
          </article>
          <article class="card" data-cat="oneoff seasonal">
            <div class="wcard__media"><img src="assets/img/snowmen-lights.jpg" alt="Finished clay snowmen with fairy lights" loading="lazy"></div>
            <div class="wcard__body">
              <span class="badge badge--ok">● Available</span>
              <h3>Christmas gifts, made early</h3>
              <p class="wcard__when">Sat 24 Oct, 10am to 1pm · one-off</p>
              <div class="wcard__foot"><span class="wcard__price">£55</span><a class="btn btn--primary" data-book href="#book">Book</a></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="book" style="padding-top:10px">
      <div class="wrap">
        <div class="booking-shell reveal">
          <div class="row-between">
            <h2>Pick your date and pay securely</h2>
            <span class="auto-note" style="margin-top:0">Live booking calendar · powered by Baluu, updated from Jo's phone</span>
          </div>
          <div id="booking-embed"></div>
          <div class="booking-fallback" id="booking-fallback">
            <p style="font-family:var(--serif);font-size:1.3rem;color:var(--ink)">Online booking is warming up.</p>
            <p>Until it's live, Jo will happily save your seat the old-fashioned way.</p>
            <a class="btn btn--primary" data-tel href="#"><span>Call Jo on&nbsp;<span data-phone>07917 413699</span></span></a>
            <a class="btn btn--light" data-whatsapp href="#">WhatsApp Jo</a>
          </div>
          <p class="mt-2" style="color:var(--ink-soft)">Rather not book online? <a data-tel href="#" style="font-weight:800">Call Jo on <span data-phone>07917 413699</span></a> and she'll pop your name down. No card needed for waiting lists.</p>
        </div>

        <div class="row-between mt-3 reveal">
          <h2 style="max-width:560px">Gift vouchers cover any class on this page. The kind of present that ends up on the mantelpiece.</h2>
          <a class="btn btn--ghost" data-voucher href="baby-prints.html#voucher">Gift a voucher</a>
        </div>
      </div>
    </section>
'''

BABY = '''
    <section class="section section--blush" style="padding-top:44px">
      <div class="wrap split">
        <div>
          <p class="kicker">Bespoke baby prints · The gift no one else makes</p>
          <h1>Tiny hands, kept forever.</h1>
          <p>They grow faster than anyone warns you. One quiet morning at the studio, a gentle press into soft clay, and this exact week of their life stays with you.</p>
          <div class="chips">
            <span class="chip chip--static">New baby</span>
            <span class="chip chip--static">Christening</span>
            <span class="chip chip--static">First birthday</span>
            <span class="chip chip--static">Mother's Day</span>
            <span class="chip chip--static">Father's Day</span>
            <span class="chip chip--static">Grandparents</span>
          </div>
          <div class="hero__cta">
            <a class="btn btn--primary btn--glow" href="#enquire">Enquire about baby prints</a>
            <a class="btn btn--light" data-voucher href="#voucher">Gift a voucher</a>
          </div>
          <p class="mt-1" style="font-size:.9rem;color:var(--ink-soft)">Suitable from just a few days old. Posted anywhere in the UK.</p>
        </div>
        <div class="split__media">
          <img src="assets/img/cast-hands-feet.jpg" alt="Raised 3D ceramic cast of a baby's hands and feet, held in one hand">
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="reveal">
          <h2>Two ways to keep them</h2>
          <p class="lead">Honest prices, nothing hidden.</p>
        </div>
        <div class="grid grid--2 mt-2 reveal">
          <div class="card tier">
            <p class="kicker">Painted ceramic prints</p>
            <p class="from">from £35</p>
            <ul>
              <li>A gentle press at the studio, minutes not hours</li>
              <li>Name and date hand-painted by Jo</li>
              <li>Glazed and fired twice</li>
              <li>Gift-boxed, ready in about 3 weeks</li>
            </ul>
          </div>
          <div class="card tier">
            <p class="kicker">Raised 3D casts</p>
            <p class="from">from £60</p>
            <ul>
              <li>A deeper press for a raised, lifelike cast</li>
              <li>Choice of soft glaze finishes</li>
              <li>Oak or white box frame from £25</li>
              <li>Siblings, family and pet prints welcome</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="reveal">Every family's plate is different</h2>
        <p class="lead reveal">A few that have come out of the kiln lately.</p>
        <!-- CONSENT: real customer pieces, some showing names/dates — confirm parents' permission before launch -->
        <div class="pgrid mt-2 reveal" data-ig-grid="6">
          <figure><img src="assets/img/harper-cast.jpg" alt="Raised cast of a hand and foot in a white box frame" loading="lazy"><figcaption>Harper, nine weeks</figcaption></figure>
          <figure><img src="assets/img/phoebe-cast.jpg" alt="Raised casts of two hands and two feet in an oak frame" loading="lazy"><figcaption>Phoebe, one week old</figcaption></figure>
          <figure><img src="assets/img/family-hands-bronze.jpg" alt="Bronze-glazed cast of a whole family's hands entwined" loading="lazy"><figcaption>A whole family, one cast</figcaption></figure>
          <figure><img src="assets/img/love-frame.jpg" alt="LOVE frame with a handprint and footprint as the O and V" loading="lazy"><figcaption>The Hartleys' LOVE frame</figcaption></figure>
          <figure><img src="assets/img/footprint-clock-process.jpg" alt="A baby foot printing the hours onto a clock face" loading="lazy"><figcaption>A clock in the making</figcaption></figure>
          <figure><img src="assets/img/feet-cast-stars.jpg" alt="White cast of crossed baby feet on star fabric" loading="lazy"><figcaption>Ten tiny toes, kept</figcaption></figure>
        </div>
        <span class="auto-note">This gallery updates automatically when Jo posts on Instagram</span>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <h2 class="reveal">Clay is a slow craft, and that's the point</h2>
        <div class="steps mt-2 reveal">
          <div class="step"><span class="step__num">1</span><strong>Print</strong><p style="color:var(--ink-soft);margin:0">A gentle press into soft clay. Takes minutes.</p></div>
          <div class="step"><span class="step__num">2</span><strong>Jo glazes</strong><p style="color:var(--ink-soft);margin:0">Hand-painted and glazed in the studio.</p></div>
          <div class="step"><span class="step__num">3</span><strong>Fired twice</strong><p style="color:var(--ink-soft);margin:0">Slow drying, two firings, a lasting finish.</p></div>
          <div class="step"><span class="step__num">4</span><strong>Ready in about 3 weeks</strong><p style="color:var(--ink-soft);margin:0">Collect from the studio, or posted anywhere in the UK.</p></div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="reveal">Questions parents ask</h2>
        <div class="accordion mt-2 reveal">
          <div class="acc__item" data-open="false">
            <button class="acc__btn" aria-expanded="false">Is it safe for my baby? <span class="acc__icon" aria-hidden="true">+</span></button>
            <div class="acc__panel">Yes. We use non-toxic, skin-safe materials, suitable from just a few days old. Your baby's hand or foot only touches the soft clay for a moment.</div>
          </div>
          <div class="acc__item" data-open="false">
            <button class="acc__btn" aria-expanded="false">What's the best age? <span class="acc__icon" aria-hidden="true">+</span></button>
            <div class="acc__panel">All ages are welcome. For crisp 3D casts the sweet spot is 0 to 6 months, and footprints are usually easier than hands. Either way, we take our time — wriggles are fine.</div>
          </div>
          <div class="acc__item" data-open="false">
            <button class="acc__btn" aria-expanded="false">How long does it take? <span class="acc__icon" aria-hidden="true">+</span></button>
            <div class="acc__panel">Clay is a slow craft. Your piece dries slowly, has a first firing, is glazed by Jo, then fired again. It will be ready in about three weeks, to collect or post anywhere in the UK.</div>
          </div>
          <div class="acc__item" data-open="false">
            <button class="acc__btn" aria-expanded="false">Can we do siblings, family or pet prints? <span class="acc__icon" aria-hidden="true">+</span></button>
            <div class="acc__panel">Yes, happily. Brothers and sisters, whole families, grandparents and paws all fit on a plate. Tell us who is coming and we will make room.</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--blush" id="voucher">
      <div class="wrap row-between reveal">
        <h2 style="max-width:560px">A gift they'll keep. Vouchers cover prints, casts and any workshop.</h2>
        <a class="btn btn--primary" data-voucher href="#enquire">Gift a voucher</a>
      </div>
    </section>

    <section class="section" id="enquire">
      <div class="wrap split" style="align-items:start">
        <div>
          <h2>Tell me a little about your little one</h2>
          <form class="form mt-2" data-form="baby">
            <div>
              <label for="b-name">Your name</label>
              <input id="b-name" name="name" type="text" required placeholder="e.g. Amy Carter">
            </div>
            <div>
              <label for="b-contact">Email or phone, whichever suits</label>
              <input id="b-contact" name="contact" type="text" required placeholder="you@email.com or a mobile number">
            </div>
            <div>
              <label for="b-msg">Baby's age, prints or casts, any date in mind</label>
              <textarea id="b-msg" name="message" placeholder="Write as much or as little as you like"></textarea>
            </div>
            <button class="btn btn--primary" type="submit">Send enquiry</button>
            <p class="form__status" role="status"></p>
          </form>
        </div>
        <div class="card info-card">
          <h3>Rather talk it through?</h3>
          <p style="font-family:var(--serif);font-size:1.3rem;color:var(--accent)"><a data-tel href="#" style="text-decoration:none;color:inherit">Call Jo on <span data-phone>07917 413699</span></a></p>
          <p>Or <a data-whatsapp href="#" style="font-weight:800">WhatsApp her</a> a message and a photo of what you have in mind.</p>
          <p>Mornings are quietest. If she's mid-firing, leave a message and she'll ring back the same day.</p>
        </div>
      </div>
    </section>
'''

KILN = '''
    <section class="page-head">
      <div class="wrap">
        <h1>Around the kiln</h1>
        <p class="lead">Most people come for one class and stay for the company. This page is the studio's noticeboard, its bragging shelf, and the place to put your name down for a bench of your own.</p>
      </div>
    </section>

    <section class="section" style="padding-top:24px">
      <div class="wrap">
        <div class="row-between reveal">
          <h2>The Kiln Club</h2>
          <span class="badge badge--nf" style="margin:0">Launching this autumn</span>
        </div>
        <p class="lead reveal">For potters who've caught the bug. Monthly bench time, the wheels when you want them, and your work fired in Jo's kiln. Put your name down and be first through the door.</p>
        <div class="grid grid--3 mt-2 reveal">
          <div class="card tier">
            <p class="kicker">The Bench</p>
            <p class="from">from £45<small>/month</small></p>
            <ul>
              <li>A regular hand-building bench</li>
              <li>Tools and glazes included</li>
              <li>One firing shelf a month</li>
            </ul>
          </div>
          <div class="card tier tier--featured">
            <p class="kicker">The Wheel</p>
            <p class="from">from £65<small>/month</small></p>
            <ul>
              <li>Bench time plus the wheels</li>
              <li>Quiet-hours access</li>
              <li>Two firing shelves a month</li>
            </ul>
          </div>
          <div class="card tier">
            <p class="kicker">The Full Shelf</p>
            <p class="from">from £85<small>/month</small></p>
            <ul>
              <li>Everything in The Wheel</li>
              <li>Your own storage shelf</li>
              <li>Firing nights and socials</li>
            </ul>
          </div>
        </div>
        <div class="mt-2 reveal" style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
          <a class="btn btn--primary" href="#interest">Register your interest</a>
          <span style="color:var(--ink-soft)">No payment now. Jo will ring for a chat when the shelves go up.</span>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap">
        <h2 class="reveal">The Firing Shelf</h2>
        <p class="lead reveal">Fresh out of the kiln this week, made by members and students.</p>
        <div class="pgrid mt-2 reveal" data-ig-grid="6">
          <figure><img src="assets/img/mother-figure.jpg" alt="Clay sculpture of a mother holding a baby" loading="lazy"><figcaption>Sunday's mother and child, drying slowly</figcaption></figure>
          <figure><img src="assets/img/hare-sculpture.jpg" alt="Life-size clay hare sitting upright" loading="lazy"><figcaption>The hare, before his ears set</figcaption></figure>
          <figure><img src="assets/img/clay-houses.jpg" alt="A row of hand-built clay houses" loading="lazy"><figcaption>A street of little houses</figcaption></figure>
          <figure><img src="assets/img/whale-sculpture.jpg" alt="Clay whale held in one hand" loading="lazy"><figcaption>The whale, mid-smooth</figcaption></figure>
          <figure><img src="assets/img/snowman-sculpting.jpg" alt="Hands wrapping a clay scarf around a snowman" loading="lazy"><figcaption>A snowman gets his scarf</figcaption></figure>
          <figure><img src="assets/img/hare-workshop.jpg" alt="A large clay hare resting on the workshop table" loading="lazy"><figcaption>Big pieces on the big table</figcaption></figure>
        </div>
        <span class="auto-note">This gallery updates automatically when Jo posts on Instagram</span>
      </div>
    </section>

    <section class="section">
      <div class="wrap split" style="align-items:start">
        <div>
          <h2 class="reveal">Community noticeboard</h2>
          <div class="card notice mt-2 reveal">
            <article><strong>Firing night, last Friday of the month.</strong> The members' shelf comes out of the kiln at 6pm. Bring biscuits.</article>
            <article><strong>Kiln Club opens this autumn.</strong> Twelve benches to start — register your interest above.</article>
            <article><strong>Seen in the Arcade:</strong> Margaret's bowls, now holding keys and clementines across Westbourne.</article>
          </div>
        </div>
        <div>
          <div class="card quote reveal" style="background:var(--blush-bg)">
            <blockquote>“I came for a taster in January. I now have opinions about glaze.”</blockquote>
            <cite>Dave, Alum Chine</cite>
          </div>
          <form class="form mt-2 reveal" data-form="kilnclub" id="interest">
            <h3>Register interest in the Kiln Club</h3>
            <div>
              <label for="k-name">Your name</label>
              <input id="k-name" name="name" type="text" required placeholder="e.g. Dave Ellis">
            </div>
            <div>
              <label for="k-contact">Email or phone</label>
              <input id="k-contact" name="contact" type="text" required placeholder="you@email.com or a mobile number">
            </div>
            <button class="btn btn--primary" type="submit">Put my name down</button>
            <p class="form__status" role="status"></p>
          </form>
        </div>
      </div>
    </section>
'''

FIND = '''
    <section class="page-head">
      <div class="wrap">
        <h1>Find us</h1>
        <p class="lead">We're at 79 Poole Road, in the heart of Westbourne village. Come past the Victorian Arcade, built in 1884, turn at the corner with the UK's smallest cinema, and follow your nose to the kiln.</p>
      </div>
    </section>

    <section class="section" style="padding-top:24px">
      <div class="wrap">
        <div class="map-card reveal" id="map-embed"></div>
        <div class="mt-2 reveal">
          <a class="btn btn--ghost" data-maps-link href="#" target="_blank" rel="noopener">Open in Google Maps</a>
        </div>
        <div class="grid grid--2 mt-3 reveal">
          <div class="card info-card">
            <h3>Opening hours</h3>
            <p>Tuesday to Saturday, 9:30 to 5</p>
            <p>Evening classes till 9pm</p>
            <p>Sundays for seasonal workshops</p>
          </div>
          <div class="card info-card">
            <h3>Getting here</h3>
            <p>Step-free from the street — prams and wheelchairs welcome</p>
            <p>Buses stop on Poole Road, parking close by</p>
            <p>Fifteen minutes' walk from Alum Chine beach</p>
            <p>Well-behaved dogs welcome</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="wrap split" style="align-items:start">
        <div>
          <h2>Say hello</h2>
          <form class="form mt-2" data-form="contact">
            <div>
              <label for="c-name">Your name</label>
              <input id="c-name" name="name" type="text" required placeholder="e.g. Sue Bradley">
            </div>
            <div>
              <label for="c-contact">Email or phone, whichever suits</label>
              <input id="c-contact" name="contact" type="text" required placeholder="you@email.com or a mobile number">
            </div>
            <div>
              <label for="c-msg">Your message</label>
              <textarea id="c-msg" name="message" required placeholder="Ask anything, there are no silly questions about clay"></textarea>
            </div>
            <button class="btn btn--primary" type="submit">Send message</button>
            <p class="form__status" role="status"></p>
          </form>
        </div>
        <div class="card info-card">
          <h3>Quicker to ring?</h3>
          <p style="font-family:var(--serif);font-size:1.3rem;color:var(--accent)"><a data-tel href="#" style="text-decoration:none;color:inherit">Call Jo on <span data-phone>07917 413699</span></a></p>
          <p>Or <a data-whatsapp href="#" style="font-weight:800">WhatsApp her</a> — perfect for photos of what you'd like to make.</p>
          <p>Mornings are quietest. If she's mid-firing, leave a message and she'll ring back the same day.</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <p style="color:var(--ink-soft);font-style:italic">A footnote for the curious: Robert Louis Stevenson wrote Jekyll and Hyde a few streets from here. Westbourne has always made things.</p>
      </div>
    </section>
'''

PRIVACY = '''
    <section class="page-head">
      <div class="wrap">
        <h1>Privacy, plainly</h1>
        <p class="lead">The short version: this website collects nothing about you unless you choose to send us a message.</p>
      </div>
    </section>
    <section class="section" style="padding-top:20px">
      <div class="wrap" style="max-width:720px">
        <p><strong>Forms.</strong> When you send an enquiry, contact message, Kiln Club interest or newsletter signup, the details you type (your name, contact details and message) are emailed to Jo so she can reply. They are not used for anything else, sold, or added to any list you didn't ask to join.</p>
        <p><strong>Newsletter.</strong> If you sign up, you'll get short, occasional emails when new class dates go live. Every email includes a way to unsubscribe, or just reply and say "no more" — that works too.</p>
        <p><strong>Booking.</strong> Bookings and payments are handled by our booking provider, who process your payment details securely — this website never sees your card number. Their own privacy policy applies to the checkout.</p>
        <p><strong>Embedded services.</strong> The map on our Find Us page is provided by Google Maps, and some photo galleries load from Instagram. Those services may set their own cookies when they load.</p>
        <p><strong>Photos of your pieces (and your little ones' prints).</strong> Jo only shares photos of finished work — on this site or on Instagram — with your permission, asked at your session.</p>
        <p><strong>Questions, or want something removed?</strong> Ring Jo on <a data-tel href="#"><span data-phone>07917 413699</span></a> or email <a data-email data-email-text href="#">joskilnwestbourne@gmail.com</a> and it's done.</p>
      </div>
    </section>
'''

NOTFOUND = '''
    <section class="section center" style="padding-top:90px;padding-bottom:90px">
      <div class="wrap">
        <h1>This page wandered off to the kiln room.</h1>
        <p class="lead" style="margin:16px auto">Whatever you were looking for, it's probably one of these.</p>
        <div class="hero__cta" style="justify-content:center">
          <a class="btn btn--primary" href="index.html">Back to the studio</a>
          <a class="btn btn--ghost" href="whats-on.html">See what's on</a>
        </div>
      </div>
    </section>
'''
