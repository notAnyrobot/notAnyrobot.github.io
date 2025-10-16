## Key Concepts and Terminology

The main characters of RL are the agent and the environment. The environment is the world that the agent lives in and interacts with. At every step of interaction, the agent sees a (possibly partial) observation of the state of the world, and then decides on an action to take. The environment changes when the agent acts on it, but may also change on its own.

The agent also perceives a reward signal from the environment, a number that tells it how good or bad the current world state is. The goal of the agent is to maximize its cumulative reward, called return. Reinforcement learning methods are ways that the agent can learn behaviors to achieve its goal.

![The agent-environment interaction loop](./figures/rl_diagram_transparent_bg.png)

-   states and observations,
-   action spaces,
-   policies,
-   trajectories,
-   different formulations of return,
-   the RL optimization problem,
-   and value functions.

## States and Observations

A **state** $s$ is a complete description of the state of the world. There is no information about the world which is hidden from the state. An **observation** $o$ is a partial description of a state, which may omit information.

When the agent is able to observe the complete state of the environment, we say that the environment is **fully observed**. When the agent can only see a partial observation, we say that the environment is **partially observed**.

<div style="border-left: 4px solid #1e90ff; background: #f7f9fc; padding: 1em; border-radius: 6px;">
  <p style="margin:0; font-weight:bold; color:#1e90ff;">
    ℹ️ You Should Know
  </p>
  <p style="margin-top:0.5em;">
    Reinforcement learning notation sometimes puts the symbol for state, <em>s</em>, in places where it would be technically more appropriate to write the symbol for observation, <em>o</em>.
    Specifically, this happens when talking about how the agent decides an action.
  </p>
  <p>
    In our guide, we’ll follow standard conventions for notation, but it should be clear from context which is meant.
    If something is unclear, please raise an issue — our goal is to teach, not to confuse.
  </p>
</div>

### Action Spaces

The set of all valid actions in a given environment is often called the **action space**.Some environments, like Atari and Go, have **discrete action spaces**, where only a finite number of moves are available to the agent. Other environments, like where the agent controls a robot in a physical world, have **continuous action spaces**. In continuous spaces, actions are real-valued vectors.

### Policies

A **policy** $\pi$ is a rule used by the agent to decide which action to take next. A policy can be **deterministic**, in which case it is usually denoted by $\mu$: $$a_t = \mu(s_t),$$ or **stochastic**, in which case it is usually denoted by $\pi$: $$a_t \sim \pi(\cdot | s_t).$$

In deep RL, we deal with **parameterized policies**: policies whoes outputs are computable functions that depend on a set of parameters (e.g., the weights of a neural network) which we can adjust to change the behavior via some optimization algorithm. We often denote the parameters of such a policy by $\theta$ or $\phi$, and then write this as a subscript on the policy symbol to highlight the connection: $$\begin{aligned} a_t &= \mu_{\theta} (s_t) \\ a_t &\sim {\pi}_{\theta}(\cdot | s_t). \end{aligned}$$

#### Stochastic Policies

The two most common kinds of stochastic policies in deep RL are **categorical policies** and **diagonal Gaussian policies**. Categorical policies are used in discrete action spaces, and output a probability distribution over the finite set of possible actions. Diagonal Gaussian policies are used in continuous action spaces, and output the mean and standard deviation of a Gaussian distribution over actions. The term "diagonal" refers to the fact that the covariance matrix of the Gaussian is diagonal, meaning that the different dimensions of the action space are assumed to be independent.

Two key computations are centrally important for using and training stochastic policies:

-   **Sampling**: To select an action according to a stochastic policy, we need to be able to sample from the distribution it defines. This is often denoted with the symbol $\sim$, as in $a_t \sim \pi(\cdot | s_t)$.
-   **Probability density/mass function**: To evaluate how likely a given action is under the policy, we need to be able to compute the probability density (for continuous actions) or probability mass (for discrete actions) of that action. This is often denoted with the symbol $log~\pi_{\theta}(a_t | s_t)$.

### Trajectories

A trajectory (or rollout, or episode) $\tau$ is a sequence of states and actions in the world, $$\tau = (s_0, a_0, s_1, a_1, ..., s_T, a_T).$$ The very first state of the world, $s_0$, is randomly sampled from a distribution called the **initial state distribution**, which we denote by $p(s_0)$: $$s_0 \sim p(s_0).$$

State transitions are governed by the natural laws of the environment, and depend on only the most recent action, $a_t$. They can be either deterministic, $$s_{t+1} = f(s_t, a_t),$$ or stochastic, $$s_{t+1} \sim P(\cdot | s_t, a_t).$$

### Reward and Return

The reward function $R$ is critically imporotant in RL. It depends on the current state of the world, the action just taken, and the next state of the world: $$r_{t+1} = R(s_t, a_t, s_{t+1})$$ although frequently this is simplified to just a dependence on the current state, $r_{t} = R(s_t)$, or state-action pair, $r_{t} = R(s_t, a_t)$.

The goal the agent is to maximize some notion of cumulative reward over a trajetory, but this actually can mean a few things. We'll notate all of these cases with $R(\tau)$, and it will either be clear from context which case we mean, or it won't matter (because the same equations will hold regardless).

One kind of return is the **finite-horizon undiscounted return**, which is just the sum of rewards obtained in a fixed window of time steps: $$R(\tau) = \sum_{t=0}^{T} r_t.$$

Another kind of return is the **infinite-horizon discounted return**, which is the sum of all rewards _ever_ obtained by the agent, but discounted by how far off in the future they are obtained. This formulation of reward includes a discount factor $\gamma \in [0, 1)$: $$R(\tau) = \sum_{t=0}^{\infty} \gamma^t r_t.$$

Why would we ever want a discount factor, though? Don’t we just want to get all rewards? We do, but the discount factor is both intuitively appealing and mathematically convenient. On an intuitive level: cash now is better than cash later. Mathematically: an infinite-horizon sum of rewards may not converge to a finite value, and is hard to deal with in equations. But with a discount factor and under reasonable conditions, the infinite sum converges.

### The RL Optimization Problem

Regardless of which formulation of return we use, the goal of reinforcement learning is to find a policy that maximizes expected return when the agent acts according to that policy.

To talk about expected return, we first have to talk about probability distributions over trajectories.

Let's suppose that both the environment transitions and the policy are stochastic. Then, the probability of a $T$-step trajectory $\tau = (s_0, a_0, s_1, a_1, ..., s_T, a_T)$ is given by: $$P(\tau | \pi) = \rho_0(s_0) \prod_{t=0}^{T-1} P(s_{t+1} | s_t, a_t) \pi(a_t | s_t),$$ where $\rho_0(s_0)$ is the initial state distribution.

The expected return (for whichever formulation), denoted by $J(\pi)$, is then given by: $$J(\pi) = \int_{\tau} P(\tau | \pi) R(\tau) = \mathbb{E}_{\tau \sim P(\cdot | \pi)} [R(\tau)].$$

The central optimization problem in RL can then be expressed as: $$\pi^* = \arg\max_{\pi} J(\pi),$$ with $\pi^*$ being the optimal policy.

### Value Functions

It's often useful to know the **value** of a state, or state-action pair. By value, we mean the expected return if you start in that state (or state-action pair) and then act according to a particular policy $\pi$ thereafter. **Value functions** are used, one way or another, in nearly all RL algorithms.

There are four main functions of note here.

1. The **On-Policy Value Function**, $V^\pi(s)$, which gives the expected return starting from state $s$ and then following policy $\pi$: $$V^\pi(s) = \mathbb{E}_{\tau \sim \pi} [R(\tau) | s_0 = s]$$
2. The **On-Policy Action-Value Function**, $Q^\pi(s, a)$, which gives the expected return starting from state $s$, take an arbitrary action $a$ (which may not have come from the policy), and then following policy $\pi$ thereafter: $$Q^\pi(s, a) = \mathbb{E}_{\tau \sim \pi} [R(\tau) | s_0 = s, a_0 = a]$$
3. The **Optimal Value Function**, $V^*(s)$, which gives the expected return starting from state $s$ and then following the optimal policy $\pi^*$: $$V^*(s) = \max_{\pi} \mathbb{E}_{\tau \sim \pi} [R(\tau) | s_0 = s]$$
4. The **Optimal Action-Value Function**, $Q^*(s, a)$, which gives the expected return starting from state $s$, taking an arbitrary action $a$, and then following the optimal policy $\pi^*$ thereafter: $$Q^*(s, a) = \max_{\pi} \mathbb{E}_{\tau \sim \pi} [R(\tau) | s_0 = s, a_0 = a]$$

### The Optimal Q-Function and the Optimal Action

There is an important connection between the optimal action-value function $Q^*(s, a)$ and the action selected by the optimal policy. By definition, $Q^*(s, a)$ gives the expected return starting from state $s$, taking action $a$, and then following the optimal policy thereafter.

The optimal policy in $s$ will select whichever action maximizes the expected return from starting in $s$. Therefore, if we have $Q^*(s, a)$, we can directly obtain the optimal action $a^*(s)$, via: $$a^*(s) = \arg\max_{a} Q^*(s, a).$$

Note: there may be multiple actions which maximize $Q^*(s,a)$, in which case, all of them are optimal, and the optimal policy may randomly select any of them. But there is always an optimal policy which deterministically selects an action.

### The Bellman Equation {#bellman-equation}

All four of the value functions obey special self-consistency equations called **Bellman equations**. The basic idea behind the Bellman equations is this:

> The value of your starting point is the reward you expect to get from being there now, plus the value of where you expect to land next.

The Bellman equations for the on-policy value functions are: $$\begin{aligned} V^\pi(s) &= \mathbb{E}_{a \sim \pi s' \sim P} [r(s, a) + \gamma V^\pi (s')], \\ Q^\pi(s, a) &= \mathbb{E}_{s' \sim P} [r(s, a) + \gamma \mathbb{E}_{a' \sim \pi} [Q^\pi (s', a')]], \end{aligned}$$ where $s' \sim P$ is shorthand for $s' \sim P(\cdot | s, a)$, indicating that the next state $s'$ is sampled from the environment's transition distribution given current state $s$ and action $a$; and $a \sim \pi$ is shorthand for $a' \sim \pi(\cdot | s')$; $a' \sim \pi$ is shorthand for $a' \sim \pi(\cdot | s')$.

The Bellman equations for the optimal value functions are

$$
\begin{align*}
V^*(s) &= \max_a \mathbb{E}_{s'\sim P}{r(s,a) + \gamma V^*(s')}, \\
Q^*(s,a) &= \mathbb{E}_{s'\sim P}{r(s,a) + \gamma \max_{a'} Q^*(s',a')}.
\end{align*}
$$

The crucial difference between the Bellman equations for the on-policy value functions and the optimal value functions, is the absence or presence of the \max over actions. Its inclusion reflects the fact that whenever the agent gets to choose its action, in order to act optimally, it has to pick whichever action leads to the highest value.

### Advantage Functions

Sometimes in RL, we don't need to describe how good an ation is in an absolute sense, but only how much better it is than others on average. That is to say, we want to know the relative advantage of that action. We make this concept precise with the **advantage function**.

The advantage function $A^\pi(s, a)$ corresponding to a policy $\pi$ describes how much better taking action $a$ in state $s$ is, over randomly sampling an action from the policy $\pi(\cdot | s)$, assuming that the agent follows $\pi$ thereafter. Mathematically, it is defined as: $$A^\pi(s, a) = Q^\pi(s, a) - V^\pi(s).$$

> We’ll discuss this more later, but the advantage function is crucially important to policy gradient methods.

### (Optional) Formalism

So far, we have discussed the agent's environment in an informal way, but if you try to go digging through the litrature, you are likely to run into the standard mathematical formalism for this setting: **Markov Decision Processes** (MDPs). An MDP is a 5-tuple $(\mathcal{S}, \mathcal{A}, P, R, \rho_0)$, where:

-   $\mathcal{S}$ is the set of all valid states,
-   $\mathcal{A}$ is the set of all valid actions,
-   $R: \mathcal{S} \times \mathcal{A} \times \mathcal{S} \to \mathbb{R}$ is the reward function, with $r_t = R(s_t, a_t, s_{t+1})$,
-   $P: \mathcal{S} \times \mathcal{A} \to \mathcal{P}(\mathcal{S})$ is the transition probability distribution, with $P(s' | s, a)$ being the probability of landing in state $s'$ after taking action $a$ in state $s$, and
-   $\rho_0$ is the initial state distribution.

The name Markov Decision Process refers to the fact that the system obeys the Markov property: transitions only depend on the most recent state and action, and no prior history.
