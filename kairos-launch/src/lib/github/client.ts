/**
 * GitHub API Client
 * Handles GitHub API requests for repository access verification
 */

const GITHUB_API_BASE = "https://api.github.com";

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
  };
}

/**
 * Verify repository access
 */
export async function verifyRepositoryAccess(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubRepository> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Repository ${owner}/${repo} not found or access denied`);
    }
    if (response.status === 403) {
      throw new Error("GitHub API rate limit exceeded or access denied");
    }
    const error = await response.text();
    throw new Error(`Failed to verify repository access: ${error}`);
  }

  return response.json();
}

/**
 * Check if repository is private
 */
export async function isRepositoryPrivate(
  token: string,
  owner: string,
  repo: string
): Promise<boolean> {
  try {
    const repository = await verifyRepositoryAccess(token, owner, repo);
    return repository.private;
  } catch (error) {
    console.error("Error checking repository privacy:", error);
    throw error;
  }
}

