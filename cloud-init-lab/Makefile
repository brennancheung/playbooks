all: clean build run

INSTANCE_NAME := "vm"
CLOUD_IMAGE_FILE = "bionic-server-cloudimg-amd64.img"
CLOUD_IMAGE_BASE_URL := "http://cloud-images.ubuntu.com/bionic/current"
CLOUD_IMAGE_URL := "$(CLOUD_IMAGE_BASE_URL)/$(CLOUD_IMAGE_FILE)"

download:
	wget $(CLOUD_IMAGE_URL)

clean:
	@echo "Removing build artifacts"
	-@rm -f config.img 2>/dev/null
	-@virsh destroy $(INSTANCE_NAME) 2>/dev/null || true
	-@virsh undefine $(INSTANCE_NAME) 2>/dev/null || true
	-@rm -f $(INSTANCE_NAME).img

build: 
	@echo "Building cloud config drive"
	cloud-localds config.img config.yaml
	cp $(CLOUD_IMAGE_FILE) $(INSTANCE_NAME).img

run:
	@echo "Spawning instance $(INSTANCE_NAME)"
	virt-install \
		--name $(INSTANCE_NAME) \
		--memory 8192 \
		--disk ./$(INSTANCE_NAME).img,device=disk,bus=virtio \
		--disk ./config.img,device=cdrom \
		--os-type linux \
		--os-variant ubuntu18.04 \
		--virt-type kvm \
		--graphics none \
		--network bridge=br0
