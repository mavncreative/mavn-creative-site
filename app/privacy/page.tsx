import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MAVN Creative",
  description:
    "How MAVN Creative collects, uses, and protects personal information from our website, lead forms, ads, and text messages.",
};

const GOLD = "text-[#efcb6d]";

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-12 border-b border-white/10 pb-3 text-xl font-semibold text-white">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className={`mt-7 text-base font-semibold ${GOLD}`}>{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-7 text-white/75">{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-7 text-white/75">
          <span className="mt-3 h-1 w-1 flex-none rounded-full bg-[#efcb6d]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-[#efcb6d]/25 bg-[#1a1a1a] p-5 text-sm leading-6 text-white/80">
      {children}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#efcb6d]/20 bg-black">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="MAVN Creative" className="h-9 w-auto object-contain" />
            <div className="leading-tight">
              <p className="text-xs font-semibold tracking-[0.16em] text-white">MAVN Creative</p>
              <p className="text-[10px] tracking-[0.24em] text-[#efcb6d]">REAL ESTATE MEDIA</p>
            </div>
          </a>
          <a href="/" className="text-sm text-white/60 transition hover:text-[#efcb6d]">
            ← Back to site
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14 lg:px-8 lg:py-20">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/50">
          <strong className="font-medium text-white/70">Effective date:</strong> August 20, 2026
          {" · "}
          <strong className="font-medium text-white/70">Last updated:</strong> August 20, 2026
        </p>

        <p className="mt-7 border-t border-[#efcb6d]/40 pt-6 leading-7 text-white/85">
          MAVN Creative (&quot;MAVN Creative,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          produces photography and video content for real estate agents and brokerages in the
          Minneapolis–Saint Paul metro area. This policy explains what personal information we
          collect, why we collect it, who we share it with, and the choices you have. It applies to
          mavncreative.com, our landing pages and lead forms, our advertising on Instagram and
          Facebook, and the email and text messages we send.
        </p>
        <P>
          If you do not agree with this policy, please do not submit information to us through our
          forms or ads.
        </P>

        <H2>1. Who We Are</H2>
        <P>
          MAVN Creative is a real estate media company based in the Twin Cities, Minnesota. We are
          the party responsible for the personal information described in this policy. You can reach
          us any time using the contact details in Section 14.
        </P>

        <H2>2. Information We Collect</H2>
        <H3>Information you give us directly</H3>
        <P>
          We collect information you provide when you fill out a form, respond to an ad, book a
          call, message us, or become a client. Depending on how you reach us, this may include:
        </P>
        <UL
          items={[
            "Your first and last name",
            "Email address and phone number",
            "The brokerage or team you work with",
            "Property addresses, listing details, and access instructions for shoots",
            "The services you are interested in and your timeline",
            "Content preferences, brand direction, and other information you share during a discovery call or intake form",
            "Correspondence between you and us, including texts, emails, and messages sent through social platforms",
          ]}
        />
        <P>
          Payment details are handled by our payment processor. We do not collect or store full card
          or bank account numbers ourselves.
        </P>

        <H3>Information collected automatically</H3>
        <P>
          When you visit our website or landing pages, we and our analytics and advertising
          providers may automatically collect:
        </P>
        <UL
          items={[
            "IP address and approximate location derived from it",
            "Browser type, device type, and operating system",
            "Pages viewed, links clicked, time on page, and referring URL",
            "Identifiers set by cookies and similar technologies",
          ]}
        />

        <H3>Information from advertising platforms</H3>
        <P>
          When you submit an Instant Form on one of our Instagram or Facebook ads, Meta passes us
          the information you confirmed in that form. Some of those fields are pre-filled by Meta
          from your profile. You can review what a form will send before you submit it, and you can
          choose not to submit.
        </P>

        <H2>3. How We Use Your Information</H2>
        <P>We use personal information to:</P>
        <UL
          items={[
            "Respond to your inquiry and follow up about working together",
            "Schedule and run discovery calls, shoots, and deliveries",
            "Produce, edit, and deliver the photography and video you hire us for",
            "Send you quotes, contracts, invoices, and project updates",
            "Send marketing emails and text messages you have consented to receive",
            "Measure how our ads and content perform, and improve them",
            "Maintain business records and meet legal, tax, and accounting obligations",
            "Protect against fraud, abuse, and security threats",
          ]}
        />

        <H2>4. Text Messages</H2>
        <P>
          If you give us your mobile number through one of our forms, ads, or in conversation, you
          agree that we may contact you by text about your inquiry and the services you asked about.
          Message frequency varies based on your conversation with us. Message and data rates may
          apply.
        </P>
        <UL
          items={[
            <>
              To stop receiving texts, reply <strong className="text-white">STOP</strong> to any
              message. You will receive a confirmation and no further messages.
            </>,
            <>
              To rejoin after opting out, reply <strong className="text-white">START</strong> or
              contact us directly.
            </>,
            <>
              For help, reply <strong className="text-white">HELP</strong> or email
              contact@mavncreative.com.
            </>,
            "Carriers are not liable for delayed or undelivered messages.",
          ]}
        />
        <Callout>
          <strong className="text-white">Mobile information and third parties.</strong> No mobile
          information will be shared with third parties or affiliates for marketing or promotional
          purposes. Information sharing to subcontractors in support services, such as customer
          service, is permitted. All other use case categories exclude text messaging originator
          opt-in data and consent; this information will not be shared with any third parties.
        </Callout>

        <H2>5. Cookies and Tracking Technologies</H2>
        <P>
          We use cookies, pixels, and similar technologies on our website and landing pages. These
          fall into a few categories:
        </P>
        <UL
          items={[
            <>
              <strong className="text-white">Essential</strong> — needed for pages and forms to
              function.
            </>,
            <>
              <strong className="text-white">Analytics</strong> — help us understand how visitors
              find and use our site.
            </>,
            <>
              <strong className="text-white">Advertising</strong> — including the Meta Pixel, which
              lets us measure the performance of our Instagram and Facebook ads and show follow-up
              ads to people who have visited our site or engaged with our content.
            </>,
          ]}
        />
        <P>
          You can control cookies through your browser settings. You can also limit ad
          personalization directly with the platforms: Meta&apos;s ad preferences are available in
          your Instagram or Facebook account settings, and Google&apos;s are available through
          Google&apos;s Ads Settings. Blocking cookies may cause parts of our site to stop working
          correctly.
        </P>

        <H2>6. How We Share Your Information</H2>
        <P>
          We do not sell your personal information, and we do not share it with third parties for
          their own independent marketing. We share it only in these situations:
        </P>
        <H3>Service providers</H3>
        <P>
          We use outside vendors to run the business. They receive only the information they need to
          perform their function and are not permitted to use it for their own purposes. Categories
          include:
        </P>
        <UL
          items={[
            "Customer relationship management and marketing automation platforms",
            "Email and text message delivery providers",
            "Scheduling and calendar tools",
            "Payment processing and invoicing services",
            "Cloud storage, file delivery, and backup services",
            "Website hosting and analytics providers",
            "Advertising platforms, including Meta",
          ]}
        />
        <H3>Legal and safety</H3>
        <P>
          We may disclose information if required by law, subpoena, or other legal process, or where
          we believe disclosure is necessary to protect our rights, your safety, or the safety of
          others.
        </P>
        <H3>Business transfers</H3>
        <P>
          If MAVN Creative is involved in a merger, acquisition, or sale of assets, personal
          information may be transferred as part of that transaction. We will notify you before your
          information becomes subject to a materially different privacy policy.
        </P>
        <Callout>
          All of the above categories exclude text messaging originator opt-in data and consent;
          this information will not be shared with any third parties, excluding aggregators and
          providers of the Text Message services.
        </Callout>

        <H2>7. Photography and Video Content</H2>
        <P>
          Our work produces images and video of properties, and sometimes of the people in them. A
          few things worth stating plainly:
        </P>
        <UL
          items={[
            <>
              <strong className="text-white">Property media.</strong> Photography and video we
              produce for a listing may include interior and exterior views of the property. Clients
              are responsible for having the property owner&apos;s permission before we shoot.
            </>,
            <>
              <strong className="text-white">People in our content.</strong> When you appear in
              content we produce, we may use that content in our portfolio, on our website, and in
              our social media and advertising, unless your agreement with us says otherwise or you
              ask us not to.
            </>,
            <>
              <strong className="text-white">Requesting removal.</strong> If you appear in content
              we have published and you want it taken down, email us at contact@mavncreative.com and
              we will remove it from channels we control. Content that has been reshared by others
              may remain online outside our control.
            </>,
          ]}
        />

        <H2>8. How Long We Keep Information</H2>
        <P>
          We keep lead and inquiry information for as long as it is useful for following up, and
          then for a reasonable period afterward in case you come back to us. We keep client
          records, contracts, and invoices for as long as required for tax, accounting, and legal
          purposes. We keep produced media files as described in your service agreement. You can ask
          us to delete your information at any time using Section 10.
        </P>

        <H2>9. How We Protect Information</H2>
        <P>
          We use reasonable administrative and technical safeguards to protect personal information,
          including access controls on the tools we use and encrypted connections for our website
          and forms. No method of transmission or storage is completely secure, and we cannot
          guarantee absolute security.
        </P>

        <H2>10. Your Privacy Rights</H2>
        <P>Depending on where you live, you may have the right to:</P>
        <UL
          items={[
            "Access the personal information we hold about you and obtain a copy",
            "Correct information that is inaccurate",
            "Request deletion of your personal information",
            "Obtain a list of the categories of third parties we have disclosed your information to",
            "Opt out of targeted advertising and of any sale of personal data",
            "Opt out of marketing emails and text messages at any time",
          ]}
        />
        <P>
          Minnesota residents have these rights under the Minnesota Consumer Data Privacy Act, and
          residents of other states have comparable rights under their own laws. Some of those laws
          exempt small businesses like ours based on size and revenue thresholds.{" "}
          <strong className="text-white">
            We honor these requests from anyone who asks, regardless of whether a particular law
            requires us to.
          </strong>
        </P>
        <P>
          To make a request, email{" "}
          <a
            href="mailto:contact@mavncreative.com?subject=Privacy%20Request"
            className="font-medium text-[#efcb6d] hover:underline"
          >
            contact@mavncreative.com
          </a>{" "}
          with the subject line &quot;Privacy Request.&quot; We will respond within 45 days. We may
          need to verify your identity before acting, which usually means confirming you control the
          email address or phone number associated with the information. If we decline a request, we
          will tell you why and how to appeal.
        </P>

        <H2>11. Children&apos;s Privacy</H2>
        <P>
          Our services are directed to real estate professionals and are not intended for anyone
          under 18. We do not knowingly collect personal information from children. If you believe a
          child has given us information, contact us and we will delete it.
        </P>

        <H2>12. Third-Party Links and Platforms</H2>
        <P>
          Our website, emails, and social profiles link to sites and platforms we do not control,
          including Instagram, Facebook, YouTube, and TikTok. This policy does not cover their
          practices. Review their privacy policies directly to understand how they handle your
          information.
        </P>

        <H2>13. Changes to This Policy</H2>
        <P>
          We may update this policy as our business and the tools we use change. When we do, we will
          revise the &quot;Last updated&quot; date at the top of this page. If the changes are
          significant, we will make that clear on our website. Continuing to use our services after
          an update means you accept the revised policy.
        </P>

        <H2>14. Contact Us</H2>
        <P>Questions about this policy, or want to make a privacy request? Get in touch:</P>
        <div className="mt-5 rounded-2xl border border-[#efcb6d]/20 bg-[#1a1a1a] p-6 text-sm leading-7 text-white/75">
          <p className="font-semibold text-white">MAVN Creative</p>
          <p>
            Email:{" "}
            <a
              href="mailto:contact@mavncreative.com"
              className="text-[#efcb6d] hover:underline"
            >
              contact@mavncreative.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:6124883825" className="text-[#efcb6d] hover:underline">
              612-488-3825
            </a>
          </p>
          <p>Web: mavncreative.com</p>
          <p>Minneapolis–Saint Paul, Minnesota</p>
        </div>
      </main>

      <footer className="border-t border-[#efcb6d]/20 bg-black">
        <div className="mx-auto max-w-3xl px-5 py-8 text-center text-sm text-white/50 lg:px-8">
          MAVN Creative · mavncreative.com · contact@mavncreative.com · 612-488-3825
        </div>
      </footer>
    </div>
  );
}
