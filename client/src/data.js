export const courses = [
  { code: "AZ-104", title: "Microsoft Azure Administrator", description: "Five Azure administration domains with 100 shuffled questions.", sections: [
    { name: "Identity & Governance", description: "Entra ID, RBAC, Policy, subscriptions, and resource governance." }, { name: "Storage", description: "Storage accounts, Blob Storage, Azure Files, and data lifecycle." }, { name: "Compute", description: "Virtual machines, App Service, containers, and scale sets." }, { name: "Networking", description: "VNets, NSGs, routing, load balancing, DNS, and private access." }, { name: "Monitoring & Recovery", description: "Azure Monitor, alerts, Backup, Site Recovery, and optimization." }
  ] },
  { code: "Docker", title: "Docker Foundations", description: "Learn container images, runtime, networking, storage, and delivery.", sections: [
    { name: "Fundamentals", description: "Images, containers, Dockerfiles, and the Docker runtime." }, { name: "Networking & Storage", description: "Container networking, volumes, mounts, and configuration." }, { name: "Images & Registries", description: "Build, tag, publish, secure, and manage container images." }, { name: "Compose & Operations", description: "Multi-container applications, health, logs, and operations." }, { name: "Security & Delivery", description: "Secure images and deliver reliable container workloads." }
  ] },
  { code: "Kubernetes", title: "Kubernetes Administration", description: "Practice workloads, networking, configuration, security, and operations.", sections: [
    { name: "Workloads", description: "Pods, deployments, jobs, and workload controllers." }, { name: "Networking & Storage", description: "Services, ingress, persistent storage, and cluster networking." }, { name: "Configuration", description: "ConfigMaps, Secrets, labels, namespaces, and scheduling." }, { name: "Security", description: "RBAC, network policies, image security, and pod protection." }, { name: "Operations", description: "Scaling, observability, upgrades, and reliable operations." }
  ] },
  { code: "DevOps", title: "DevOps Engineer", description: "Build confidence across CI/CD, automation, infrastructure, and reliability.", sections: [
    { name: "Foundations", description: "Collaboration, version control, branching, and delivery culture." }, { name: "Continuous Integration", description: "Builds, tests, artifacts, and quality gates." }, { name: "Continuous Delivery", description: "Releases, approvals, environments, and deployment strategies." }, { name: "Infrastructure", description: "Infrastructure as code, containers, orchestration, and GitOps." }, { name: "Reliability", description: "Monitoring, incident response, SLOs, and continuous improvement." }
  ] }
];

export const sections = courses[0].sections;
