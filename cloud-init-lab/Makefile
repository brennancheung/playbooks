NODE_NUM     ?= 1

IP            := 10.0.0.4$(NODE_NUM)
INSTANCE_NAME := node$(NODE_NUM).mh1.dev
DISK_SIZE     := 40G
MEMORY        := 16384
VCPUS         := 16

# CLOUD_IMAGE_FILE     := "bionic-server-cloudimg-amd64.img"
# CLOUD_IMAGE_BASE_URL := "http://cloud-images.ubuntu.com/bionic/current"

CLOUD_IMAGE_FILE     := xenial-server-cloudimg-amd64-disk1.img
CLOUD_IMAGE_BASE_URL := https://cloud-images.ubuntu.com/xenial/current
CLOUD_IMAGE_URL      := "$(CLOUD_IMAGE_BASE_URL)/$(CLOUD_IMAGE_FILE)"
BUILD_DIR            := "$(INSTANCE_NAME)"
CLOUD_IMAGE_URL      := "$(CLOUD_IMAGE_BASE_URL)/$(CLOUD_IMAGE_FILE)"
DISK_IMAGE_FILE      := "$(BUILD_DIR)/$(INSTANCE_NAME).img"
SEED_IMAGE_FILE      := "$(BUILD_DIR)/$(INSTANCE_NAME)-seed.img"
NET_CONFIG_FILE      := "$(BUILD_DIR)/network-config-v2.yaml"
NET_CONFIG_TEMPLATE  := "network-config-v2.template.yaml"
USER_DATA_TEMPLATE   := "user-data-template.yaml"
USER_DATA_FILE       := "$(BUILD_DIR)/user-data.yaml"

run: build
	$(call spacing,"Spawning instance: $(INSTANCE_NAME)")
	virt-install \
		--name $(INSTANCE_NAME) \
		--memory $(MEMORY) \
		--vcpus $(VCPUS) \
		--disk $(DISK_IMAGE_FILE),device=disk,bus=virtio \
		--disk $(SEED_IMAGE_FILE),device=cdrom \
		--os-type linux \
		--os-variant ubuntu16.04 \
		--virt-type kvm \
		--graphics none \
		--network bridge=br0

build: | $(BUILD_DIR) $(SEED_IMAGE_FILE) $(DISK_IMAGE_FILE)

$(BUILD_DIR):
	$(call spacing,"Create folder: $(INSTANCE_NAME)")
	mkdir $(BUILD_DIR) || true

seed $(SEED_IMAGE_FILE): | $(BUILD_DIR) $(NET_CONFIG_FILE) $(USER_DATA_FILE)
	$(call spacing,"Build cloud-init image")
	cloud-localds -v --network-config=$(NET_CONFIG_FILE) $(SEED_IMAGE_FILE) $(USER_DATA_FILE)

net $(NET_CONFIG_FILE): | $(BUILD_DIR)
	$(call spacing,"Build net config: $(IP)")
	sed 's/__IPADDRESS__/${IP}/g' $(NET_CONFIG_TEMPLATE) > $(NET_CONFIG_FILE)

image $(DISK_IMAGE_FILE): | $(BUILD_DIR)
	$(call spacing,"Build main disk image: $(DISK_SIZE)")
	cp $(CLOUD_IMAGE_FILE) $(DISK_IMAGE_FILE)
	qemu-img resize $(DISK_IMAGE_FILE) $(DISK_SIZE)

$(USER_DATA_FILE): | $(BUILD_DIR)
	$(call spacing,"Build user-data: $(IP)")
	sed 's/__HOSTNAME__/$(INSTANCE_NAME)/g' $(USER_DATA_TEMPLATE) > $(USER_DATA_FILE)

download:
	if [ ! -r $(CLOUD_IMAGE_FILE) ]; then
		wget $(CLOUD_IMAGE_URL)
	fi

clean:
	$(call spacing,"Removing artifacts and VM for $(INSTANCE_NAME)")
	sudo rm -rf $(BUILD_DIR)
	virsh destroy $(INSTANCE_NAME) 2> /dev/null || true
	virsh undefine $(INSTANCE_NAME) 2> /dev/null || true

define spacing
	@echo "\n===== $(if $1,$1,$@) ====="
endef

