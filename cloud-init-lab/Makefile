IP := 10.0.0.41
INSTANCE_NAME := node1.mh1.dev
DISK_SIZE := 40G
MEMORY=16384
VCPUS=16

# CLOUD_IMAGE_FILE = "bionic-server-cloudimg-amd64.img"
# CLOUD_IMAGE_BASE_URL := "http://cloud-images.ubuntu.com/bionic/current"

CLOUD_IMAGE_FILE = xenial-server-cloudimg-amd64-disk1.img
CLOUD_IMAGE_BASE_URL := https://cloud-images.ubuntu.com/xenial/current

CLOUD_IMAGE_URL := "$(CLOUD_IMAGE_BASE_URL)/$(CLOUD_IMAGE_FILE)"
SEED_IMAGE_FILE := "$(INSTANCE_NAME)-seed.img"
NET_CONFIG_FILE := network-config-v2.yaml
NET_CONFIG_TEMPLATE := network-config-v2.template.yaml

DISK_IMAGE_FILE = "$(INSTANCE_NAME).img"


run: build
	@echo "Spawning instance $(INSTANCE_NAME)"
	virt-install \
		--name $(INSTANCE_NAME) \
		--memory $(MEMORY) \
		--vcpus $(VCPUS) \
		--disk $(INSTANCE_NAME).img,device=disk,bus=virtio \
		--disk $(SEED_IMAGE_FILE),device=cdrom \
		--os-type linux \
		--os-variant ubuntu16.04 \
		--virt-type kvm \
		--graphics none \
		--network bridge=br0

build: $(SEED_IMAGE_FILE) $(DISK_IMAGE_FILE)

$(SEED_IMAGE_FILE): $(NET_CONFIG_FILE)
	# Build the seed image
	cloud-localds -v --network-config=$(NET_CONFIG_FILE) $(SEED_IMAGE_FILE) user-data.yaml

$(NET_CONFIG_FILE):
	# Build net-config-v2.yaml
	sed 's/__IPADDRESS__/${IP}/g' $(NET_CONFIG_TEMPLATE) > $(NET_CONFIG_FILE)

$(DISK_IMAGE_FILE):
	@echo "Build main disk image"
	cp $(CLOUD_IMAGE_FILE) $(DISK_IMAGE_FILE)
	qemu-img resize $(DISK_IMAGE_FILE) $(DISK_SIZE)

download:
	wget $(CLOUD_IMAGE_URL)

clean:
	@echo "Removing build artifacts"
	-@sudo rm -f $(SEED_IMAGE_FILE) 2>/dev/null
	-@virsh destroy $(INSTANCE_NAME) 2>/dev/null || true
	-@virsh undefine $(INSTANCE_NAME) 2>/dev/null || true
	-@sudo rm -f $(INSTANCE_NAME).img

