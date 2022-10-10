<script setup lang="ts">
import { onBeforeUpdate, ref, type Ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

/**
 * defineProps will access parent properties for modal view component
 */
const props = defineProps({
  showDeleteModal: Boolean,
  invoiceId: String,
});

/**
 * defineEmits will access & emits parent methods for modal view component
 */
const emit = defineEmits(["hideDeleteModal", "deleteInvoiceById"]);

/**
 * openModal will access parent property showDeleteModal & toggles the modal
 */
let openModal: Ref<boolean> = ref(props.showDeleteModal);

/**
 * invoiceId will access parent property invoiceId to get invoice data
 */
const invoiceId: Ref<string | undefined> = ref(props.invoiceId);

/**
 * onBeforeUpdate life cycle method to get triggred before content updates
 */
onBeforeUpdate(() => {
  openModal.value = props.showDeleteModal;
});

/**
 * closeModal method to triggred parent method hideDeleteModal when close button is clicked
 */
const closeModal = (): void => {
  emit("hideDeleteModal");
};

/**
 * deleteInvoice method to triggred parent method deleteInvoiceById when delete button is clicked
 */
const deleteInvoice = (): void => {
  emit("deleteInvoiceById");
};
</script>
<template>
  <TransitionRoot as="template" :show="openModal">
    <Dialog as="div" class="relative z-10" @close="openModal = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden delete-modal-main-div rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" class="mb-3 font-medium"
                      >Confirm Deletion</DialogTitle
                    >
                    <div class="mt-2">
                      <p class="text-sm">
                        Are you sure you want to delete invoice #{{
                          invoiceId
                        }}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="delete-modal-btns px-4 py-3 sm:flex sm:flex-row-revers sm:px-6"
              >
                <button
                  type="button"
                  class="mt-3 cancel-btn inline-flex w-full justify-center br-3 px-4 py-2 text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="closeModal"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex w-full justify-center br-3 bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="deleteInvoice"
                >
                  Delete
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
.mb-3 {
  margin-bottom: 1em;
}
.br-3 {
  border-radius: 1rem;
}

.cancel-btn {
  background-color: #2c3e50ad;
}

.delete-modal-main-div {
  background-color: #252945;
  color: #fff;
}

.delete-modal-btns {
  justify-content: flex-end;
}
</style>
