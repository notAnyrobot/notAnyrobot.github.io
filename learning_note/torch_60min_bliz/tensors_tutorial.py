import numpy as np
import torch

##############################
# Tensor Initialization
# ~~~~~~~~~~~~~~~~~~~~~
#
# **Directly from data**

data = [[1, 2], [3, 4]]
x_data = torch.tensor(data)

##############################
# **From a NumPy array**

np_array = np.array(data)
x_np = torch.from_numpy(np_array)

##############################
# **From another tensor**

x_ones = torch.ones_like(x_data)
print(f"Ones Tensor: \n {x_ones} \n")

x_rand = torch.rand_like(x_data, dtype=torch.float64)
print(f"Random Tensor: \n {x_rand} \n")

##############################
#  **With random or constant values**

shape = (
    2,
    3,
)
rand_tensor = torch.rand(shape)
ones_tensor = torch.ones(shape)
zeros_tensor = torch.zeros(shape)

print(f"Random Tensor: \n {rand_tensor} \n")
print(f"Ones Tensor: \n {ones_tensor} \n")
print(f"Zeros Tensor: \n {zeros_tensor} \n")


##############################
# Tensor Attributes

tensor = torch.rand(3, 4)
print(f"Shape of tensor: \n {tensor.shape} \n")
print(f"Datatype of tensor: \n {tensor.dtype} \n")
print(f"Device tensor is stored on: \n { tensor.device} \n")

##############################
# Tensor Operations
#
# Move tensor to the GPU if available
if torch.cuda.is_available():
    tensor = tensor.to("cuda")
    print(f"Device tensor is stored on: \n { tensor.device} \n")

##############################
# Indexing and slicing

tensor = torch.ones(4, 4)
tensor[:, 1] = 0
print(tensor)

##############################
#  Joining tensors
t1 = torch.cat([tensor, tensor, tensor], dim=1)
print(t1)

##############################
# Multiplying tensors
#
# Element-wise product
print(f"tensor.mul(tensor): \n {tensor.mul(tensor)} \n")
# Alternative syntax
print(f"tensor * tensor: \n {tensor * tensor} \n")

# Matrix multiplication
print(f"tensor.matmul(tensor.T): \n {tensor.matmul(tensor.T)} \n")
# Alternative syntax
print(f"tensor @ tensor.T: \n {tensor @ tensor.T} \n")

##############################
# **In-place Operations**
#
print(tensor)
tensor.add_(5)
print(tensor)

# .. note ::
#   inplace operations save some memory, but can be probmatic when computing
#   derivatives because of immediate loss of history. Hence, their use is discouraged.

# Bridge with NumPy {#bridge-to-np-label}
# =================
#
# Tensors on the CPU and NumPy arrays can share their underlying memory
# locations, and changing one will change the other.
t = torch.ones(5)
print(f"t: {t}")
n = t.numpy()
print(f"n: {n}")

# A change in the tensor reflects in the NumPy array.
t.add_(1)
print(f"t: {t}")
print(f"n: {n}")

# NumPy array to Tensor
# =====================
n = np.ones(5)
t = torch.from_numpy(n)

# Changes in the NumPy array reflects in the tensor.
np.add(n, 1, out=n)
print(f"t: {t}")
print(f"n: {n}")
