## Part 3: Intro to Policy Optimization

In this section, we’ll discuss the mathematical foundations of policy optimization algorithms, and connect the material to sample code. We will cover three key results in the theory of **policy gradients**:

-   the simplest equation describing the gradient of policy performance with respect to policy parameters,
-   a rule which allows us to drop useless terms from that expression,
-   and a rule which allows us to add useful terms to that expression.

### Deriving the Simplest Policy Gradient

Here, we consider the case of astochastic parameterized policy $\pi_{\theta}$. We aim to maximize the xpedted return $J(\theta) = \mathbb{E}_{\tau \sim \pi_{\theta}}[R(\tau)]$. For the purposes of this derivation, we’ll take $R(\tau)$ to give the finite-horizon undiscounted return, but the derivation for the infinite-horizon discounted return setting is almost identical.

We would like to optimize the policy by gradient ascent, e.g., $$\theta_{k+1} = \theta_k + \alpha \nabla_{\theta} J(\theta_k).$$ The gradient of policy perfomance, $\nabla_{\theta} J(\theta)$, is called the **policy gradient**, and algorithms that optimize the policy using this gradient are called **policy gradient algorithms**.

To actually use this algorithm, we need an expression for the policy gradient which we can nuerically compute. This involves two steps:

1. Deriving the analytical gradient of policy performance, which turns out to have the form of an expected value, and
2. forming a sample estimate of this expected value, which can be computed with data from a finite number of agent-environment interaction steps.

In this subsection, we’ll find the simplest form of that expression. In later subsections, we’ll show how to improve on the simplest form to get the version we actually use in standard policy gradient implementations.

1. **Probability of a Trajectory**. First, we need to write down the probability of a trajectory $\tau = (s_0, a_0, s_1, a_1, \ldots, s_{T}, a_{T}, s_{T+1})$ under the policy $\pi_{\theta}$: $$P(\tau | \theta) = \rho(s_0) \prod_{t=0}^{T} P(s_{t+1} | s_t, a_t) \pi_{\theta}(a_t | s_t).$$
2. **The Log-Derivative Trick**. The log-derivative trick is based on a simple rule from calculus: the derivative of $\text{log}~x$ with respect to $x$ is $1/x$. When rearranged and combined with chain rule, we get: $$\nabla_{\theta} P(\tau | \theta) = P(\tau | \theta) \nabla_{\theta} \text{log}~P(\tau | \theta).$$
3. **Log-Probability of a Trajectory**. The log-prob of a trajectory is just $$\text{log}~P(\tau | \theta) = \text{log}~\rho(s_0) + \sum_{t=0}^{T} \left(\text{log}~P(s_{t+1} | s_t, a_t) + \text{log}~\pi_{\theta}(a_t | s_t)\right).$$
4. Gradients of Environment Functions. The environment has no dependence on $\theta$, so gradients of $\rho_0(s_0)$, $P(s_{t+1} | s_t, a_t)$, and $ R(\tau)$ with respect to $\theta$ are all zero.
5. **Grad-Log-Prob of a Trajectory**. The gradient of the log-prob of a trajectory is thus: $$\begin{align*} \nabla_{\theta} \text{log}~P(\tau | \theta)& = \cancel{\nabla_{\theta} \text{log}~\rho(s_0)} + \sum_{t=0}^{T} \left(\cancel{\nabla_{\theta} \text{log}~P(s_{t+1} | s_t, a_t)} + \nabla_{\theta} \text{log}~\pi_{\theta}(a_t | s_t)\right) \\ &= \sum_{t=0}^{T} \nabla_{\theta} \text{log}~\pi_{\theta}(a_t | s_t). \end{align*}$$

Putting it all together, we derive the following:

> **Derivation for Basic Policy Gradient**

$$
\begin{align*}
\nabla_{\theta} J(\theta) &= \nabla_{\theta} \mathbb{E}_{\tau \sim \pi_{\theta}}[R(\tau)] \\
&= \nabla_{\theta} \int_{\tau} P(\tau | \theta) R(\tau) && \text{(Expand expectation)} \\
&= \int_{\tau} \nabla_{\theta} P(\tau | \theta) R(\tau) && \text{(Move gradient inside integral)} \\
&= \int_{\tau} P(\tau | \theta) \nabla_{\theta} \text{log}~P(\tau | \theta) R(\tau) && \text{(Log-derivative trick)} \\
&= \mathbb{E}_{\tau \sim \pi_{\theta}}[\nabla_{\theta} \text{log}~P(\tau | \theta) R(\tau)] && \text{(Rewrite as expectation)} \\
\therefore \nabla_{\theta} J(\pi_{\theta}) &= \mathbb{E}_{\tau \sim \pi_{\theta}}\left[\sum_{t=0}^{T} \nabla_{\theta} \text{log}~\pi_{\theta}(a_t | s_t) R(\tau)\right] && \text{(Expression for grad-log-prob of a trajectory)}
\end{align*}
$$

This is an expectation, which means that we can estimate it with a sample mean. If we collect a set of trajectories $\mathcal{D} = \set{\tau_i}_{i=1,\ldots, N}$ where each trajectory $\tau_i$ is obtained by executing the policy $\pi_{\theta}$ in the environment, then we can estimate the policy gradient as follows: $$\hat{g} = \frac{1}{| \mathcal{D} |} \sum_{\tau \in \mathcal{D}} \left(\sum_{t=0}^{T} \nabla_{\theta} \text{log}~\pi_{\theta}(a_t | s_t)\right) R(\tau),$$ where $| \mathcal{D} |$ is the number of trajectories in $\mathcal{D}$ (here, $N$).

This last expression is the simplest version of the computable expression we desired. Assuming that we have represented our policy in a way which allows us to calculate $\nabla_{\theta} \log \pi_{\theta}(a|s)$, and if we are able to run the policy in the environment to collect the trajectory dataset, we can compute the policy gradient and take an update step.

### Implementing the Simplest Policy Gradient
