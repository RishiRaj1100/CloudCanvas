export interface AWSService {
  id: string
  name: string
  shortName: string
  category: 'compute' | 'database' | 'storage' | 'networking' | 'security' | 'monitoring'
  icon: string
  color: string
  description: string
  whyNeeded: string
  whatItDoes: string
  analogy: string
  position: { x: number; y: number }
  connections: string[]
}

export const awsServices: AWSService[] = [
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    shortName: 'CloudFront',
    category: 'networking',
    icon: 'globe',
    color: '#8C4FFF',
    description: 'Content Delivery Network',
    whyNeeded: 'Users across India need fast access. Without CDN, someone in Chennai waits for data from Mumbai.',
    whatItDoes: 'Caches your app at 400+ edge locations worldwide. Reduces latency from 200ms to 20ms.',
    analogy: 'Like having a local photocopy shop instead of ordering from a distant printer.',
    position: { x: 100, y: 200 },
    connections: ['alb']
  },
  {
    id: 'alb',
    name: 'Application Load Balancer',
    shortName: 'Load Balancer',
    category: 'networking',
    icon: 'split',
    color: '#8C4FFF',
    description: 'Traffic Distribution',
    whyNeeded: 'One server cannot handle Diwali traffic. When 10,000 users hit at once, you need distribution.',
    whatItDoes: 'Distributes incoming requests across multiple EC2 servers. Health checks ensure only healthy servers receive traffic.',
    analogy: 'Like a restaurant host seating guests at different tables to balance the load.',
    position: { x: 250, y: 200 },
    connections: ['ec2-1', 'ec2-2']
  },
  {
    id: 'ec2-1',
    name: 'EC2 Instance 1',
    shortName: 'Server 1',
    category: 'compute',
    icon: 'server',
    color: '#FF9900',
    description: 'Spring Boot Application',
    whyNeeded: 'Your Java code needs to run somewhere. EC2 gives you a virtual server in the cloud.',
    whatItDoes: 'Runs your Spring Boot payment API. Handles authentication, business logic, API endpoints.',
    analogy: 'Your own computer in the cloud, but you only pay for what you use.',
    position: { x: 400, y: 120 },
    connections: ['rds', 'lambda', 's3']
  },
  {
    id: 'ec2-2',
    name: 'EC2 Instance 2',
    shortName: 'Server 2',
    category: 'compute',
    icon: 'server',
    color: '#FF9900',
    description: 'Spring Boot Application (Backup)',
    whyNeeded: 'Redundancy. If Server 1 crashes, Server 2 keeps your app running. Zero downtime.',
    whatItDoes: 'Identical copy of Server 1. Auto Scaling adds more during traffic spikes.',
    analogy: 'Like having a backup goalkeeper - ready to jump in if needed.',
    position: { x: 400, y: 280 },
    connections: ['rds', 'lambda', 's3']
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    shortName: 'Lambda',
    category: 'compute',
    icon: 'zap',
    color: '#FF9900',
    description: 'Fraud Detection Function',
    whyNeeded: 'Fraud detection needs to run instantly, but only when payments happen. Why pay for idle servers?',
    whatItDoes: 'Analyzes each transaction for fraud patterns. Machine learning model checks amount, frequency, location.',
    analogy: 'A security guard who appears instantly when needed and disappears when not.',
    position: { x: 550, y: 200 },
    connections: ['cloudwatch']
  },
  {
    id: 'rds',
    name: 'Amazon RDS',
    shortName: 'PostgreSQL',
    category: 'database',
    icon: 'database',
    color: '#3B48CC',
    description: 'PostgreSQL Database',
    whyNeeded: 'User accounts, transaction history, balances - all need reliable, persistent storage.',
    whatItDoes: 'Managed PostgreSQL with automatic backups, encryption, and multi-AZ failover.',
    analogy: 'A professional bank vault with automatic backups every day.',
    position: { x: 550, y: 350 },
    connections: ['cloudwatch']
  },
  {
    id: 's3',
    name: 'Amazon S3',
    shortName: 'S3 Bucket',
    category: 'storage',
    icon: 'folder',
    color: '#569A31',
    description: 'Receipt & Document Storage',
    whyNeeded: 'Every transaction generates a PDF receipt. Where do you store millions of files?',
    whatItDoes: 'Stores transaction receipts, user documents. 99.999999999% durability (11 nines).',
    analogy: 'An infinitely large filing cabinet that never loses a document.',
    position: { x: 700, y: 120 },
    connections: []
  },
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch',
    shortName: 'CloudWatch',
    category: 'monitoring',
    icon: 'activity',
    color: '#FF4F8B',
    description: 'Monitoring & Logging',
    whyNeeded: 'How do you know if something breaks at 3 AM? You need eyes on the system 24/7.',
    whatItDoes: 'Collects logs, metrics, alarms. Alerts you when CPU spikes or errors increase.',
    analogy: 'A dashboard camera for your infrastructure - recording everything.',
    position: { x: 700, y: 280 },
    connections: []
  }
]

export const paymentFlowSteps = [
  {
    service: 'cloudfront',
    title: 'Request Arrives',
    description: 'Rahul opens SecurePay and initiates a ₹500 transfer to Priya',
    detail: 'CloudFront receives the HTTPS request at the nearest edge location in Mumbai. SSL termination happens here.',
    duration: 800
  },
  {
    service: 'alb',
    title: 'Load Balancing',
    description: 'Traffic is distributed to a healthy server',
    detail: 'ALB checks health of both EC2 instances, routes to Server 1 which has lower latency right now.',
    duration: 600
  },
  {
    service: 'ec2-1',
    title: 'API Processing',
    description: 'Spring Boot validates the request',
    detail: 'JWT token verified. User authenticated. Business logic validates: sufficient balance, valid recipient.',
    duration: 1000
  },
  {
    service: 'lambda',
    title: 'Fraud Detection',
    description: 'Transaction analyzed for suspicious patterns',
    detail: 'Lambda invoked synchronously. ML model checks: unusual amount? new device? strange location? Result: APPROVED.',
    duration: 1200
  },
  {
    service: 'rds',
    title: 'Database Transaction',
    description: 'Atomic balance update in PostgreSQL',
    detail: 'BEGIN TRANSACTION. Debit Rahul ₹500. Credit Priya ₹500. COMMIT. ACID compliant - no money lost.',
    duration: 800
  },
  {
    service: 's3',
    title: 'Receipt Generated',
    description: 'PDF receipt uploaded to storage',
    detail: 'Transaction receipt generated as PDF. Uploaded to S3 with encryption. Signed URL sent to user.',
    duration: 600
  },
  {
    service: 'cloudwatch',
    title: 'Metrics Logged',
    description: 'Transaction recorded for monitoring',
    detail: 'Latency: 4.2s. Status: SUCCESS. Amount: ₹500. Logged for analytics and audit trail.',
    duration: 400
  }
]

export const architectureConnections = [
  { from: 'cloudfront', to: 'alb', label: 'HTTPS' },
  { from: 'alb', to: 'ec2-1', label: 'HTTP/8080' },
  { from: 'alb', to: 'ec2-2', label: 'HTTP/8080' },
  { from: 'ec2-1', to: 'lambda', label: 'Invoke' },
  { from: 'ec2-2', to: 'lambda', label: 'Invoke' },
  { from: 'ec2-1', to: 'rds', label: 'JDBC' },
  { from: 'ec2-2', to: 'rds', label: 'JDBC' },
  { from: 'ec2-1', to: 's3', label: 'SDK' },
  { from: 'ec2-2', to: 's3', label: 'SDK' },
  { from: 'lambda', to: 'cloudwatch', label: 'Logs' },
  { from: 'rds', to: 'cloudwatch', label: 'Metrics' },
]

export const costBreakdown = [
  { service: 'EC2', description: '2x t2.micro instances', monthlyCost: 0, freeTierLimit: '750 hours/month' },
  { service: 'RDS', description: 'db.t2.micro PostgreSQL', monthlyCost: 0, freeTierLimit: '750 hours/month' },
  { service: 'S3', description: 'Standard storage', monthlyCost: 0, freeTierLimit: '5 GB storage' },
  { service: 'Lambda', description: 'Fraud detection functions', monthlyCost: 0, freeTierLimit: '1M requests/month' },
  { service: 'CloudFront', description: 'CDN data transfer', monthlyCost: 0, freeTierLimit: '1 TB/month' },
  { service: 'CloudWatch', description: 'Monitoring & logs', monthlyCost: 0, freeTierLimit: '10 custom metrics' },
  { service: 'ALB', description: 'Load balancer', monthlyCost: 0, freeTierLimit: '750 hours/month' },
]

export const upiStats = {
  dailyTransactions: '500 million+',
  yearlyValue: '₹200 trillion+',
  peakTPS: '100,000+',
  diwaliSpike: '5x normal traffic',
  apps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM'],
}
