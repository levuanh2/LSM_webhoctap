import threading
import time
from confluent_kafka import Consumer, KafkaException, KafkaError
from app.config import settings
from app.kafka.event_handlers import process_message

stop_event = threading.Event()

def start_kafka_consumer():
    """
    Reads Kafka topics synchronously in a background thread.
    """
    conf = {
        'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS,
        'group.id': settings.KAFKA_GROUP_ID,
        'auto.offset.reset': 'earliest'
    }

    try:
        consumer = Consumer(conf)
    except Exception as e:
        print(f"Failed to initialize Kafka consumer: {e}")
        return

    topics = [
        settings.TOPIC_USER_REGISTERED,
        settings.TOPIC_COURSE_ENROLLED,
        settings.TOPIC_LESSON_COMPLETED,
        settings.TOPIC_PROGRESS_UPDATED,
        settings.TOPIC_COURSE_RATED
    ]

    consumer.subscribe(topics)

    print(f"Kafka Consumer started for {topics}...")

    while not stop_event.is_set():
        msg = consumer.poll(timeout=1.0)
        
        if msg is None:
            continue
            
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                # End of partition
                continue
            else:
                print(f"Consumer error: {msg.error()}")
                break

        # Message is valid
        topic = msg.topic()
        val = msg.value().decode('utf-8')
        process_message(topic, val)

    consumer.close()

def start_consumer_thread():
    stop_event.clear()
    thread = threading.Thread(target=start_kafka_consumer, daemon=True)
    thread.start()
    return thread

def stop_consumer_thread():
    stop_event.set()
