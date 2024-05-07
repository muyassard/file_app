import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils';

import { nextTick } from 'vue';
import Multiple from '../Multiple.vue';

describe('Multiple', () => {
    it('adds files that do not exceed the limit to multiData', async () => {
        const wrapper = mount(Multiple, {
            props: {
                maxSize: 1000000,
                limit: 3,
                type: 'zip',
            },
        });


        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const mockFileList = Object.create(inputElement.files);

        const file1 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        const file2 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        mockFileList[0] = file1;
        mockFileList[1] = file2;

        Object.defineProperty(mockFileList, 'length', { value: 2 });
        (wrapper.getCurrentComponent().exposed as unknown as any).change({
            target: { files: mockFileList },
        });


        await nextTick();

        const multiData = wrapper.find("multiData")

        expect(wrapper.vm.multiData.length).toBe(2);
    });

    it('limits the number of files added to multiData when exceeding the limit', async () => {
        const wrapper = mount(Multiple, {
            props: {
                maxSize: 1000000,
                limit: 2,
                type: 'zip',
            },
        });

        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const mockFileList = Object.create(inputElement.files);

        const file1 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        const file2 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        const file3 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        mockFileList[0] = file1;
        mockFileList[1] = file2;
        mockFileList[2] = file3;

        Object.defineProperty(mockFileList, 'length', { value: 3 });
        (wrapper.getCurrentComponent().exposed as unknown as any).change({
            target: { files: mockFileList },
        });


        await nextTick();

        expect(wrapper.vm.multiData.length).toBe(2);
    });

    it('if another type of file arrives, it will not be added to multiData', async () => {
        const wrapper = mount(Multiple, {
            props: {
                maxSize: 1000000,
                limit: 2,
                type: 'pdf',
            },
        });

        const inputElement = wrapper.find('input[type="file"]').element as HTMLInputElement;
        const mockFileList = Object.create(inputElement.files);


        const file1 = new File(['2777'], 'foo.pdf', {
            type: 'application/pdf',
        });

        const file2 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        const file3 = new File(['2777'], 'foo.zip', {
            type: 'application/zip',
        });
        mockFileList[0] = file1;
        mockFileList[1] = file2;
        mockFileList[2] = file3;




        Object.defineProperty(mockFileList, 'length', { value: 3 });
        (wrapper.getCurrentComponent().exposed as unknown as any).change({
            target: { files: mockFileList },
        });

        await nextTick();

        expect(wrapper.vm.multiData.length).toBe(1);
    });





});
