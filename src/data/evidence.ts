export interface EvidenceCard {
  id: string
  label: string
  description: string
  imagePath: string
}

export const evidenceCards: EvidenceCard[] = [
  {
    id: 'ev-01',
    label: 'VPC Subnet Design',
    description: 'Public and private subnet layout showing internet gateway and NAT routing.',
    imagePath: '/evidence/vpc-subnet-design.png'
  },
  {
    id: 'ev-02',
    label: 'IAM Role Permissions',
    description: 'Least-privilege role policy attached to EC2 and Lambda runtimes.',
    imagePath: '/evidence/iam-role-permissions.png'
  },
  {
    id: 'ev-03',
    label: 'EC2 Service Runtime',
    description: 'SecurePay Spring Boot services running on EC2 instance and systemd status.',
    imagePath: '/evidence/ec2-service-runtime.png'
  },
  {
    id: 'ev-04',
    label: 'RDS Connectivity',
    description: 'PostgreSQL instance endpoint, subnet group, and active connections view.',
    imagePath: '/evidence/rds-connectivity.png'
  },
  {
    id: 'ev-05',
    label: 'S3 Receipt Objects',
    description: 'Receipt PDF files uploaded with key naming and metadata.',
    imagePath: '/evidence/s3-receipt-objects.png'
  },
  {
    id: 'ev-06',
    label: 'Lambda Fraud Test',
    description: 'Lambda test event and decision payload with risk score output.',
    imagePath: '/evidence/lambda-fraud-test.png'
  },
  {
    id: 'ev-07',
    label: 'API Gateway Route',
    description: 'POST /fraud-check route integrated with Lambda and stage invoke URL.',
    imagePath: '/evidence/api-gateway-route.png'
  },
  {
    id: 'ev-08',
    label: 'CloudFront Distribution',
    description: 'Distribution settings, cache behavior, and origin mappings.',
    imagePath: '/evidence/cloudfront-distribution.png'
  },
  {
    id: 'ev-09',
    label: 'ALB Target Health',
    description: 'Target group health checks and listener forwarding rules.',
    imagePath: '/evidence/alb-target-health.png'
  },
  {
    id: 'ev-10',
    label: 'CloudWatch Dashboard',
    description: 'Latency, error rate, and payment throughput widgets on one dashboard.',
    imagePath: '/evidence/cloudwatch-dashboard.png'
  },
  {
    id: 'ev-11',
    label: 'End-to-End Transaction Log',
    description: 'Correlated log trace from request ingress to transaction completion.',
    imagePath: '/evidence/transaction-log-trace.png'
  },
  {
    id: 'ev-12',
    label: 'Cost and Free Tier Snapshot',
    description: 'Billing and usage view confirming workloads remain in free-tier limits.',
    imagePath: '/evidence/cost-free-tier-snapshot.png'
  }
]
