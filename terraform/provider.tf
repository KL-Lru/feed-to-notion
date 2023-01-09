provider "google" {
  project = var.project-id
}

terraform {
	required_providers {
		google = {
	    version = "~> 4.47.0"
		}
  }
}
