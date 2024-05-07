<script setup lang="ts">
  import { ref } from "vue";

  import { CreateImage } from "@/modules/api";
  import type { Image } from "@/modules/type";

  import defaultImage from "@/images/defaultImage.png";

  import { message } from "antd";
  import { Status } from "@/util/status";
  import { getFileType } from "@/util/fileType";

  interface Props {
    maxSize: number;
    limit: number;
    type: string;
  }
  const props = defineProps<Props>();

  const multiData = ref<Image[]>([]);
  const isLoading = ref(false);

  const change = async (e: Event) => {
    let files = (e.target as HTMLInputElement).files;

    if (!files?.length) return;

    let len = files.length;

    if (files.length > props.limit) {
      len = props.limit;
      message.error("you are uploading a lot of files");
    }

    for (let i = 0; i < len; i++) {
      if (!files[i].type.includes(props.type)) {
        message.error("you cannot upload such a file");
      } else {
        multiData.value.push({
          photo: getFileType(files[i]),
          file: files[i],
          status: "",
          id: files[i].lastModified,
        });
      }
      if (multiData.value.length >= props.limit) {
        multiData.value.length = props.limit;
      }
    }
    console.log(multiData.value);
  };

  const upload = async () => {
    if (multiData.value.length > 0) {
      try {
        isLoading.value = true;

        multiData.value.forEach(async (multi) => {
          if (multi.status !== Status.success && multi.status !== Status.failed) {
            if (multi.file?.size! > props.maxSize) {
              multi.status = Status.failed;
              message.error("This image size is large");
            } else {
              await CreateImage(multi.file!);
              multi.status = Status.success;
            }
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        isLoading.value = false;
      }
    } else {
      message.error("you have not selected a file yet");
    }
  };

  const remove = (id: number) => {
    const removeElm = multiData.value.filter((file: Image) => file.id !== id);
    multiData.value = removeElm;
  };

  defineExpose({
    change,
    upload,
    remove,
  });
</script>

<template>
  <div class="flex items-end gap-2">
    <div class="grid gap-3 w-[200px]">
      <div class="">Multi</div>
      <label
        :style="{
          backgroundImage: `url(${defaultImage})`,
        }"
        class="image border"
      >
        <input
          data-type="multipleInput"
          @change="change"
          type="file"
          class="hidden"
          multiple
        />
      </label>
      <b class="">you can only upload a {{ props.type }} file</b>

      <button
        data-type="multipleUploadButton"
        @click="upload"
        :disabled="isLoading"
        class="text-white bg-blue-500 w-[200px]"
      >
        {{ isLoading ? "uploading..." : "upload" }}
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <div class="relative" v-for="multi in multiData" :key="multi.id">
        <img class="w-[200px] h-[200px] object-cover" :src="multi.photo" alt="" />
        <img class="absolute top-0 left-1 w-[30px]" :src="multi.status" />
        <div class="mb-2">{{ multi.file?.name }}</div>
        <button class="bg-blue-500 text-white w-[200px]" @click="() => remove(multi.id)">
          Remove
        </button>
      </div>
    </div>
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
