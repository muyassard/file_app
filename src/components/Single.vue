<script setup lang="ts">
  import { CreateImage } from "@/modules/api";

  import defaultImage from "@/images/defaultImage.png";

  import { getFileType } from "@/util/fileType";
  import type { Image } from "@/modules/type";

  import { ref } from "vue";

  import { message } from "antd";
  import { Status } from "@/util/status";

  interface Props {
    maxSize: number;
    type: string;
  }

  const props = defineProps<Props>();

  const image = ref<Image>({
    photo: "",
    status: "",
    file: null,
    id: 0,
  });

  const isLoading = ref(false);
  const errorMessage = ref(false);

  const singleChange = async (e: Event) => {
    image.value.status = "";

    const files = (e.target as HTMLInputElement).files;
    const selectedFile = files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.includes(props.type)) {
        errorMessage.value = true;
        message.error("you cannot upload such a file");
      } else if (selectedFile.size > props.maxSize) {
        errorMessage.value = true;
        image.value.status = Status.failed;
        message.error("This image size is large");
      } else {
        errorMessage.value = false;
        image.value.photo = getFileType(selectedFile);
        image.value.file = selectedFile;
        image.value.id = selectedFile.lastModified;
        console.log(image.value.file);
      }
    }
  };

  const uploadSingle = async (data: Image) => {
    if (data.file) {
      if (data.status) {
        message.error("you have uploaded a file");
        return;
      } else {
        try {
          errorMessage.value = false;
          isLoading.value = true;
          const imageUrl = await CreateImage(data.file);
          console.log(imageUrl);
          data.status = Status.success;
        } catch (error) {
          errorMessage.value = true;

          data.status = Status.error;
        } finally {
          isLoading.value = false;
        }
      }
    } else {
      message.error("you have not selected a file yet");
    }
  };
  defineExpose({
    singleChange,
    uploadSingle,
  });
</script>

<template>
  <div class="grid gap-2 w-[200px]">
    <div>Single</div>
    <label
      :style="{
        backgroundImage: `url(${image.photo || defaultImage})`,
      }"
      class="image border relative"
    >
      <img class="absolute top-0 left-1 w-[30px]" :src="image.status" />
      <input @change="singleChange" type="file" class="hidden" />
    </label>

    <div class="">{{ image?.file?.name }}</div>
    <p error-message v-if="errorMessage" class="">error</p>
    <b class="">you can only upload a {{ props.type }} file</b>

    <button
      data-type="singleUploadButton"
      @click="uploadSingle(image)"
      :disabled="isLoading"
      class="text-white bg-blue-500 w-[200px]"
    >
      {{ isLoading ? "uploading..." : "upload" }}
    </button>
  </div>
</template>

<style scoped>
  .image {
    width: 200px;
    height: 200px;
    background-position: center;
    background-size: cover;
  }
</style>
