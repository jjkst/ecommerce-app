import { Service } from '../models/service.model';

export const MOCK_PRODUCTS: Service[] = [
  {
    Id: 1,
    Title: 'Photo Shoot',
    FileName: 'assets/Outdoor-Dining-and-Vistas.jpg',
    Description: 'Professional photography services',
    Features: [
      `Custom Website Design & Development: We'll create a stunning, responsive, and user-friendly website tailored to your brand and objectives.`,
      'SEO Optimization: We build your website with best practices for search engine optimization to help you rank higher and attract more organic traffic.',
      'Website Hosting & Domain Management: Secure and reliable hosting, plus assistance with managing your domain name.',
      'Regular Backups: Your data is safe with automated, frequent backups to prevent any loss.',
      'Security Monitoring: Proactive monitoring and immediate response to potential security threats.',
      'Performance Optimization: We ensure your website loads quickly and performs smoothly across all devices.',
      'Ongoing Support & Consulting: Dedicated support for any questions or issues, along with strategic advice for your online presence.',
    ],
    PricingPlans: [
      {
        Name: 'Basic Plan',
        InitialSetupFee: 'Starting from $X,XXX (One-time charge)',
        MonthlySubscription: '$XX/month',
        Features: [
          'Custom 5-page website design',
          'Responsive design (mobile-friendly)',
          'Basic SEO setup',
          'Standard hosting',
          'Monthly security updates',
          'Email support',
          'Up to 1 hour of content updates/month'
        ]
      },
      {
        Name: 'Standard',
        InitialSetupFee: 'Starting from $Y,YYYY (One-time charge)',
        MonthlySubscription: '$YY/month',
        Features: [
          'Custom 10-15 page website design',
          'Advanced SEO optimization',
          'Premium hosting with faster loading speeds',
          'Weekly security and software updates',
          'Priority email and phone support',
          'Up to 3 hours of content updates/month',
          'Blog setup and integration',
        ],
      },
      {
        Name: 'Premium',
        InitialSetupFee: 'Starting from $X,ZZZZ (One-time charge)',
        MonthlySubscription: '$ZZ/month',
        Features: [
          'Unlimited custom page design',
          'In-depth SEO strategy and ongoing optimization',
          'High-performance hosting with CDN',
          'Daily security monitoring and real-time threat protection',
          '24/7 dedicated support (email, phone, chat)',
          'Up to 6 hours of content updates/month',
          'E-commerce functionality, CRM integration, consulting',
        ],
      },
    ],
  },
];
