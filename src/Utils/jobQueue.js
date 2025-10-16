const queue = [];
let running = false;

export const addJob = (job) => {
    queue.push(job);
    if (!running) runWorker();
};

const runWorker = () => {
    running = true;

    const processNextJob = async () => {
        if (queue.length === 0) {
            running = false;
            return;
        }

        const job = queue.shift();
        try {
            console.log(".....job.type, job.payload......", job.type, job.payload);

            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            console.log(".......Emailsent........", job.type, job.payload);
        } catch (error) {
            console.error("...error....", error);
        } finally {processNextJob();

        }
  };

  processNextJob();
};
