import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "How ALiN Move and the ALiN Move Rider App collect, use, share, and protect personal data, including precise location data.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <h1>ALiN Move Privacy Policy</h1>
      <p>Effective and last updated: July 23, 2026</p>
      <p>
        ALiN Move, operated by ALiN Tech (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;), provides the ALiN Move website, customer services, and
        ALiN Move Rider mobile application (collectively, the &quot;Services&quot;).
        This policy explains how we access, collect, use, share, retain, and protect
        personal data when you use the Services.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Account and registration information</h3>
      <ul>
        <li>Name, email address, mobile number, home address, and branch assignment.</li>
        <li>Vehicle type, plate number, vehicle details, and payout information.</li>
        <li>
          Rider identity and eligibility documents, including driver&apos;s license,
          official receipt, certificate of registration, NBI clearance, selfie,
          and vehicle photographs.
        </li>
        <li>
          Information submitted through our website, support channels, applications,
          registration forms, and waitlist.
        </li>
      </ul>

      <h3>Precise location data</h3>
      <p>
        With your permission, the Rider App accesses and collects precise device
        location, including latitude, longitude, heading, and speed, in these
        circumstances:
      </p>
      <ul>
        <li>
          <strong>During registration:</strong> the App may request a one-time
          foreground location to suggest a nearby branch. You may skip this and
          search for a branch manually.
        </li>
        <li>
          <strong>While you are online and available:</strong> while the App is open
          and in the foreground, it sends location updates approximately every 30
          seconds so authorized dispatch and branch personnel can see available
          riders and offer nearby jobs.
        </li>
        <li>
          <strong>During an active delivery:</strong> while the App is open and in
          the foreground, it sends location updates approximately every 5 seconds
          for dispatch, live delivery tracking, route guidance, distance
          calculations, pickup and drop-off verification, and estimated arrival.
        </li>
        <li>
          <strong>Safety and SOS:</strong> when you activate an emergency feature,
          your current location may be shared with authorized branch personnel and
          nearby participating riders so they can respond.
        </li>
      </ul>
      <p>
        The Rider App does not collect location in the background. Location
        reporting stops when the App is no longer active in the foreground, when
        you go offline, or when you revoke location permission. The Android build
        does not request the ACCESS_BACKGROUND_LOCATION permission.
      </p>

      <h3>Device and usage information</h3>
      <ul>
        <li>Device model, operating-system and App versions, and device identifiers.</li>
        <li>Push-notification tokens used for job offers, account updates, and alerts.</li>
        <li>Server logs, IP address, browser or App diagnostics, and crash information.</li>
        <li>Aggregated website and service analytics.</li>
      </ul>

      <h2>2. How we use information</h2>
      <ul>
        <li>Create, authenticate, secure, and manage customer and rider accounts.</li>
        <li>Verify rider identity and eligibility and process KYC documentation.</li>
        <li>Match available riders with nearby jobs and operate branch dispatch.</li>
        <li>Provide navigation, live delivery tracking, delivery status, and support.</li>
        <li>Respond to emergencies, investigate safety incidents, and prevent fraud.</li>
        <li>Calculate earnings, process payouts, and maintain transaction records.</li>
        <li>Send OTPs, job offers, service messages, and account-status notifications.</li>
        <li>Maintain, troubleshoot, secure, and improve the Services.</li>
        <li>Meet legal, tax, regulatory, audit, and dispute-resolution obligations.</li>
      </ul>

      <h2>3. When we share information</h2>
      <ul>
        <li>
          <strong>Branches and authorized operations personnel:</strong> rider
          identity, vehicle details, availability, location, and delivery status
          may be used for dispatch, operations, support, and safety.
        </li>
        <li>
          <strong>Customers and recipients:</strong> during an active delivery,
          limited rider identity, delivery status, and live location may be shown
          for delivery tracking and coordination.
        </li>
        <li>
          <strong>Service providers:</strong> providers supporting authentication,
          databases, file storage, realtime services, SMS, push notifications,
          maps and routing, hosting, analytics, and support process data only to
          provide those services to us.
        </li>
        <li>
          <strong>Legal and safety disclosures:</strong> we may disclose information
          when required by law or reasonably necessary to protect users, the public,
          our rights, or the security of the Services.
        </li>
      </ul>
      <p>We do not sell personal data or use Rider App location data for advertising.</p>

      <h2>4. Retention</h2>
      <p>
        We retain personal data only as long as reasonably necessary for the
        purposes described in this policy, including providing an active account,
        completing deliveries, resolving disputes, supporting safety
        investigations, preventing fraud, and meeting legal, financial, audit, and
        regulatory requirements. Retention periods vary by record type and legal
        obligation. OTPs expire after five minutes and cannot be used after expiry.
        When data is no longer required, we delete, anonymize, or securely restrict it.
      </p>

      <h2>5. Security</h2>
      <p>
        We use administrative, technical, and organizational safeguards designed
        to protect personal data, including encrypted network connections,
        authentication, access controls, secure device storage for authentication
        tokens, and restricted access to KYC documents. No system is completely
        secure, but we review and improve these safeguards as our Services evolve.
      </p>

      <h2>6. Your choices and rights</h2>
      <ul>
        <li>
          You can allow or revoke location permission through your device settings.
          Without location access, nearby-branch suggestions, online availability,
          navigation, dispatch, and active-delivery tracking may not function.
        </li>
        <li>
          Riders control availability using the online/offline control. Going
          offline stops availability location reporting.
        </li>
        <li>
          You can disable push notifications in device settings, though you may
          miss job offers and important service messages.
        </li>
        <li>
          You may request access, correction, or deletion of personal data, subject
          to identity verification and applicable legal retention requirements.
          See <a href="/legal/data-deletion">Data Deletion</a>.
        </li>
      </ul>

      <h2>7. Children</h2>
      <p>
        The Rider App is intended only for eligible adults aged 18 or older. We do
        not knowingly collect Rider App registration information from children.
      </p>

      <h2>8. Policy changes</h2>
      <p>
        We may update this policy as our Services or legal obligations change. We
        will update the date above and provide additional notice through the App,
        website, or email when appropriate.
      </p>

      <h2>9. Contact us</h2>
      <p>
        For privacy questions or data-rights requests, email{" "}
        <a href="mailto:privacy@alinmove.com">privacy@alinmove.com</a> or{" "}
        <a href="mailto:support@alinmove.com">support@alinmove.com</a>.
      </p>
      <p>ALiN Move / ALiN Tech, Philippines.</p>
    </>
  );
}
