## Part 2: Kinds of RL Algorithms

### A Taxonomy of RL Algorithms

![rl_algorithms](./figures/rl_algorithms_9_15.svg)
_Figure 1: A non-exhaustive, but useful taxonomy of algorithms in modern RL. [See links below.](#rl-taxonomy-links)_

The goals of this document are to:

-   highlight the most foundational design choices in deep RL algorithms about what to learn and how to learn it,
-   expose the trade-offs in those choices, and
-   place a few prominent modern algorithms into context with respect to those choices.

### Model-Free vs Model-Based RL

One of the most fundamental design choices in RL is **whether the agent has access to (or learns) a model of the environment's dynamics**. By a _model_ of the environment, we mean a function that predicts state transition and rewards given the current state and action.

The main upside to having a model is that **it allows the agent to plan** by simulating future trajectories for a range of possible actions, and explicitly deciding between its options. Agents can then distill the results from planning ahead into a learned policy.

The main downside is that **a ground-truth model of the environment is usually not available**.

Algorithms which use a model are called **model-based** methods, and those that don’t are called **model-free**.

### What to Learn

Another critical branching point in an RL algorithm is the question of **what to learn**. The list of ususal suspects includes:

-   policies, either stochastic or deterministic,
-   action-value functions (Q-functions),
-   value functions (V-functions),
-   and/or models of the environment.

#### What to Learn in Model-Free RL

There are two main approaches to representing and training agents with model-free RL:

1. **Policy Optimization**. Methods in this family represent a policy explicitly as $\pi_\theta(a|s)$. They optimize the parameters $\theta$ either directly by gradient ascent of the expected return $J(\theta)$ (e.g. REINFORCE, A2C/A3C, PPO, TRPO), or indirectly, by maximizing local approximations of $J(\theta)$ (e.g. DDPG, TD3, SAC). This optimization is almost always performed **on-policy**, which means that the data used to estimate the gradient is collected using the most recent version of the policy $\pi_\theta$. Policy optimization also usually involves learning an approximate value function $V_\phi(s)$ for the on-policy value function $V^{\pi}(s)$, which gets used in figuring out how to update the policy.

A couple of xeamplees of policy optimization methods are:

-   A2C / A3C (Asynchronous Advantage Actor-Critic), which performs gradient ascent to directly maximize performance,
-   and PPO (Proximal Policy Optimization), whose updates indirectly maximize performance, by instead maximizing a _surrogate objective_ function which gives a conservative estimate for how much $J(\pi_{\theta})$ will change as a result of the update.

2. **Q-Learning**. Methods in this family learn an approximateor $Q_{\theta}(s, a)$ for the optimal action-value function $Q^*(s, a)$. Typically they use an objective function based on the Bellman equation ()(See [the Bellman equation](./part1.md#bellman-equation) in Part 1 for more details). This optimization always performed **off-policy**, which means that each update can use data collected ay any point during training, regardless of how the agent was choosing to expolre the environment when the data was obtained. The corresponding policy is obtained vis th connection between $Q^*$ and the optimal policy $\pi^*$: the actions taken by the Q-learning agent are given by $$a(s) = \arg\max_a Q_{\theta}(s, a).$$

**Trade-offs Between Policy Optimization and Q-Learning.** The primary strength of policy optimization methods is that they are principled, in the sense that you _directly optimize for the thing you care about_. By contrast, Q-learning methods only _indirectly_ optimize for agent perfomance, by training $Q_{\theta}$ to satisfy a self-consistency equation. There are many failure modes for this kind of learning, so it tends to be less stable. But, Q-learning methods gain the advantage of being substaintially more sample efficient, because they can reuse data collected at any point during training.

**Interpolating Between Policy Optimization and Q-Learning.** Serendipitously, policy optimization and Q-learning are not incompatible (and under some circumstances, it turns out, equivalent), are there exist a range of algorithms that live in between the two extremes. For example,

-   DDPG (Deep Deterministic Policy Gradient), an off-policy algorithm, concurrently learns a deterministic policy $\mu_\theta(s)$ and an action-value function $Q_\phi(s, a)$ by using each to improve the other.
-   SAC (Soft Actor-Critic), a variant which uses a stochastic policy, entropy regularization, and a few other tricks to stabilize learning and score higher than DDPG on many benchmarks.

### Links to Algorithms in Taxonomy {#rl-taxonomy-links}

1. [A2C / A3C (Asynchronous Advantage Actor-Critic): Mnih et al, 2016](https://arxiv.org/abs/1602.01783)
2. [PPO (Proximal Policy Optimization): Schulman et al, 2017](https://arxiv.org/abs/1707.06347)
3. [TRPO (Trust Region Policy Optimization): Schulman et al, 2015](https://arxiv.org/abs/1502.05477)
4. [DDPG (Deep Deterministic Policy Gradient): Lillicrap et al, 2015](https://arxiv.org/abs/1509.02971)
5. [TD3 (Twin Delayed DDPG): Fujimoto et al, 2018](https://arxiv.org/abs/1802.09477)
6. [SAC (Soft Actor-Critic): Haarnoja et al, 2018](https://arxiv.org/abs/1801.01290)
7. [DQN (Deep Q-Networks): Mnih et al, 2013](https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf)
8. [C51 (Categorical 51-Atom DQN): Bellemare et al, 2017](https://arxiv.org/abs/1707.06887)
9. [QR-DQN (Quantile Regression DQN): Dabney et al, 2017](https://arxiv.org/abs/1710.10044)
10. [HER (Hindsight Experience Replay): Andrychowicz et al, 2017](https://arxiv.org/abs/1707.01495)
11. [World Models: Ha and Schmidhuber, 2018](https://worldmodels.github.io/)
12. [I2A (Imagination-Augmented Agents): Weber et al, 2017](https://arxiv.org/abs/1707.06203)
13. [MBMF (Model-Based RL with Model-Free Fine-Tuning): Nagabandi et al, 2017](https://sites.google.com/view/mbmf)
14. [MBVE (Model-Based Value Expansion): Feinberg et al, 2018](https://arxiv.org/abs/1803.00101)
15. [AlphaZero: Silver et al, 2017](https://arxiv.org/abs/1712.01815)

---

**To link to this section from elsewhere in your file, use:**

```
[Links to Algorithms in Taxonomy](#rl-taxonomy-links)
```

$$
$$
