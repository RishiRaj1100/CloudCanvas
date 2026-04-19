export interface DemoStep {
  id: string
  title: string
  description: string
  highlightedServices: string[]
}

export const demoSteps: DemoStep[] = [
  {
    id: 'step-1',
    title: 'User initiates payment request',
    description:
      'Client request enters through CloudFront and ELB, then reaches the SecurePay Spring Boot API on EC2.',
    highlightedServices: ['cloudfront', 'elb', 'ec2']
  },
  {
    id: 'step-2',
    title: 'Fraud check before processing',
    description:
      'EC2 sends payload to API Gateway, which triggers Lambda fraud scoring to approve or deny the payment.',
    highlightedServices: ['ec2', 'api-gateway', 'lambda']
  },
  {
    id: 'step-3',
    title: 'Transaction committed and receipt stored',
    description:
      'Approved payment is committed to RDS in a transaction-safe workflow and receipt artifact is uploaded to S3.',
    highlightedServices: ['ec2', 'rds', 's3']
  },
  {
    id: 'step-4',
    title: 'System observability and governance',
    description:
      'CloudWatch captures logs/metrics while IAM and VPC enforce access boundaries and network isolation.',
    highlightedServices: ['cloudwatch', 'iam', 'vpc']
  }
]
