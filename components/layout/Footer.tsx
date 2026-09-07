export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><strong>Product</strong><a href="/how-it-works">How It Works</a><a href="/platform">Platform</a><a href="/example-report">Example Report</a><a href="/assessment">Start Assessment</a></div>
        <div><strong>Research</strong><a href="/research">Research</a><a href="/pilot">Pilot Program</a><a href="/healthcare-professionals">Healthcare Professionals</a></div>
        <div><strong>Company</strong><a href="/about">About</a><a href="/blog">Blog</a><a href="/contact">Contact</a></div>
        <div><strong>Legal</strong><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/cookies">Cookies</a><a href="/medical-disclaimer">Medical Disclaimer</a></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} ROOTS AI Health Systems, Inc. <span>Educational biological assessment and reporting.</span></div>
    </footer>
  );
}
